import handlerFactory from "./handlerFactory.js";
import Coupon from "../models/couponModel.js";

// @desc        Get list of coupons
// @route       GET /api/v1/coupons
// @access      Private /Admin-Manager
export const getCoupons = handlerFactory.getAll(Coupon, "Coupons");

// @desc        Get specific Coupon by id
// @route       GET /api/v1/coupons/:id
// @access      Private /Admin-Manager
export const getCouponById = handlerFactory.getOneById(Coupon);
// @desc        Create Coupon
// @route       POST /api/v1/coupons
// @access      Private

export const createCoupon = handlerFactory.createOne(Coupon);

// @desc        Update specific Coupon
// @route       PUT /api/v1/coupons/:id
// @access      Private /Admin-Manager

export const updateCoupon = handlerFactory.updateOne(Coupon);

// @desc        Delete specific Coupon
// @route       PUT /api/v1/coupons/:id
// @access      Private/Admin-Manager

export const deleteCoupon = handlerFactory.deleteOne(Coupon);
