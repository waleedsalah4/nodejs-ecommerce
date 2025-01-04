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

//merge params: Allow us to access parameters on other routers
//ex: we need to access categoryId from category router

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, getSubCategories)
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategoryById)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

export default router;
