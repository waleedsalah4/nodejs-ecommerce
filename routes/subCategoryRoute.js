import express from "express";
import {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  deleteSubCategory,
  updateSubCategory,
  setCategoryIdToBody,
  createFilterObject,
} from "../controllers/subCategoryController.js";
import {
  createSubCategoryValidator,
  getSubCategoryValidator,
  deleteSubCategoryValidator,
  updateSubCategoryValidator,
} from "../utils/validators/subCategoryValidator.js";
import { protect, allowedTo } from "../controllers/authController.js";

//merge params: Allow us to access parameters on other routers
//ex: we need to access categoryId from category router

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, getSubCategories)
  .post(
    protect,
    allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategoryById)
  .put(
    protect,
    allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

export default router;
