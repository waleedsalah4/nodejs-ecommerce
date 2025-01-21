import { body, check } from "express-validator";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import slugify from "slugify";

export const getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id"),
  validationMiddleware,
];

export const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("brand is required")
    .isLength({ min: 3 })
    .withMessage("Too short brand name")
    .isLength({ max: 32 })
    .withMessage("Too long brand name"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validationMiddleware,
];

export const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationMiddleware,
];
export const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id"),
  validationMiddleware,
];
