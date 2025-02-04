import express from "express";

import {
  getCoupons,
  createCoupon,
  getCouponById,
  deleteCoupon,
  updateCoupon,
} from "../controllers/couponController.js";

import { protect, allowedTo } from "../controllers/authController.js";

const router = express.Router();

router.use(protect, allowedTo("admin", "manager"));
router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCouponById).put(updateCoupon).delete(deleteCoupon);

export default router;
