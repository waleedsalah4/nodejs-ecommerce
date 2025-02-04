import express from "express";

import {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} from "../controllers/wishlistController.js";

import { protect, allowedTo } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.use(allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);
router.delete("/:productId", removeProductFromWishlist);

export default router;
