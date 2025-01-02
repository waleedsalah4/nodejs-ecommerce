import { check } from "express-validator";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

export const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validationMiddleware,
];

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name"),
  validationMiddleware,
];

export const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validationMiddleware,
];
export const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validationMiddleware,
];
