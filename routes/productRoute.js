import express from "express";
import reviewRoute from "./reviewRoute.js";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} from "../controllers/productController.js";

import {
  createProductValidator,
  deleteProductValidator,
  getProductValidator,
  updateProductValidator,
} from "../utils/validators/productValidators.js";
import { protect, allowedTo } from "../controllers/authController.js";

const router = express.Router();

// POST /products/164d6fdf8v4d8f/reviews
// GET /products/164d6fdf8v4d8f/reviews
// GET /products/164d6fdf8v4d8f/reviews/45848fdf8878/ => /products/:productId/reviews/:reviewId/ get specific review from specific product
router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProductById)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);

export default router;
