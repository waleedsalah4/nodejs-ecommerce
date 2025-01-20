import express from "express";

import subCategoryRoute from "./subCategoryRoute.js";

import {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} from "../controllers/categoryController.js";

import {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../utils/validators/categoryValidators.js";

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategoryById)
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

export default router;
