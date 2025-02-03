import express from "express";

import {
  getReviewById,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObject,
  setProductIdAndUserIdToBody,
} from "../controllers/reviewController.js";

import {
  createReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
  updateReviewValidator,
} from "../utils/validators/reviewValidators.js";
import { protect, allowedTo } from "../controllers/authController.js";

const router = express.Router({
  mergeParams: true,
});

router
  .route("/")
  .get(createFilterObject, getReviews)
  .post(
    protect,
    allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getReviewById)
  .put(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo("admin", "manager", "user"),
    deleteReviewValidator,
    deleteReview
  );

export default router;
