import { check } from "express-validator";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

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
  validationMiddleware,
];

export const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id"),
  validationMiddleware,
];
export const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id"),
  validationMiddleware,
];
