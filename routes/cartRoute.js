import express from "express";

import { protect, allowedTo } from "../controllers/authController.js";
import {
  addProductToCart,
  applyCoupon,
  clearCart,
  getLoggedUserCart,
  removeProductFromCart,
  updateCartItemQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

router.use(protect, allowedTo("user"));

router
  .route("/")
  .get(getLoggedUserCart)
  .post(addProductToCart)
  .delete(clearCart);

router.put("/applyCoupon", applyCoupon);
router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removeProductFromCart);

export default router;
