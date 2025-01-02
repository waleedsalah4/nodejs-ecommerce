import express from "express";

import {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../utils/validators/categoryValidators.js";

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(createCategoryValidator, createCategory);
router
  .route("/:id")
  .get(getCategoryValidator, getCategoryById)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

export default router;
