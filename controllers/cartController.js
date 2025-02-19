import asyncHandler from "express-async-handler";

import ApiError from "../utils/apiError.js";
import { ProductModel } from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import Coupon from "../models/couponModel.js";

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desc        Add product to cart
// @route       POST /api/v1/cart
// @access      Private/User

export const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color, quantity } = req.body;
  const product = await ProductModel.findById(productId);
  //1) Get cart for logged uer
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    // create card for logged user with products
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color: color,
          quantity: quantity,
          price: product.price,
        },
      ],
    });
  } else {
    // product exist in cart? => update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // product doesn't exist in cart? => push product to cart
      cart.cartItems.push({
        product: productId,
        color: color,
        quantity: quantity,
        price: product.price,
      });
    }
  }
  //calculate total price
  //   const totalPrice = calcTotalCartPrice(cart);
  //   cart.totalCartPrice = totalPrice;
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    data: cart,
  });
});

// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User
export const getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User

export const removeProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  calcTotalCartPrice(cart);
  cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private/User
export const clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const quantity = req.body.quantity;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
    );
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`there is no item for this id :${req.params.itemId}`, 404)
    );
  }

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    apply coupon in cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User

export const applyCoupon = asyncHandler(async (req, res, next) => {
  //1) get coupon based on its name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError("Coupon is invalid or expired"));
  }

  //2)get user cart to get total price
  const cart = await Cart.findOne({ user: req.user._id });
  const totalPrice = calcTotalCartPrice(cart);

  //3) calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.priceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
