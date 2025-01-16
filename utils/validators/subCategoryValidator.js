import { check, body } from "express-validator";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import slugify from "slugify";

export const getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id"),
  validationMiddleware,
];

export const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory is required")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("Too long Subcategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("category").isMongoId().withMessage("Invalid category id format"),
  validationMiddleware,
];

export const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validationMiddleware,
];
export const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id"),
  validationMiddleware,
];
