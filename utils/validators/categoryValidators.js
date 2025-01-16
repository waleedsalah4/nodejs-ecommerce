import { check, body } from "express-validator";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import slugify from "slugify";

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
    .withMessage("Too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationMiddleware,
];

export const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validationMiddleware,
];
export const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validationMiddleware,
];
