import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import handlerFactory from "./handlerFactory.js";
import { ProductModel } from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";

import { stripe } from "../utils/stripe.js";

// @desc        create cash order
// @route       POST /api/v1/orders/cartId
// @access      Protected/USer

export const createCashOrder = asyncHandler(async (req, res, next) => {
  //app setting
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
    );
  }
  // 2) Get order price depend on cart price "check if coupon apply"
  const cartPrice = cart.priceAfterDiscount
    ? cart.priceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3) create order with default paymentMethodType "cash"
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // 4) after creating order, decrease product quantity, increase product sold count
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOptions, {});
    // 5) clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ status: "Success", data: order });
});

export const filterOrdersForLoggedUser = asyncHandler(
  async (req, res, next) => {
    if (req.user.role === "user") {
      req.filterObject = { user: req.user._id };
    }
    next();
  }
);

// @desc        Get list of orders
// @route       GET /api/v1/orders
// @access      Protected /Admin-Manager-User
export const findAllOrders = handlerFactory.getAll(Order, "Orders");

// @desc    Get specific order
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
export const findSpecificOrder = handlerFactory.getOneById(Order);

// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc    Update order delivered status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager
export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to paid
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc    Get checkout session from stripe and send it as response
// @route   PUT /api/v1/orders/checkout-session/cartId
// @access  Protected/User
export const getCheckoutSession = asyncHandler(async (req, res, next) => {
  //app setting
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
    );
  }

  // 2) Get order price depend on cart price "check if coupon apply"
  const cartPrice = cart.priceAfterDiscount
    ? cart.priceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // console.log(cart.cartItems[0]);
  //3) create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            // name: `products colors => ${cart.cartItems.map((i) => i.color).join(" - ")}`,
            name: "Cart Products",
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  //4) send session to response
  res.status(200).json({ status: "success", session });
});
