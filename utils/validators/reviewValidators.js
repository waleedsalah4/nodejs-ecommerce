import { body, check } from "express-validator";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { ReviewModel } from "../../models/reviewModel.js";

export const getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id"),
  validationMiddleware,
];

export const createReviewValidator = [
  check("name").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("ratings value is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  check("user").isMongoId().withMessage("Invalid user id"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product id")
    .custom((value, { req }) =>
      ReviewModel.findOne({
        user: req.user._id,
        product: req.body.product,
      }).then((review) => {
        if (review) {
          return Promise.reject(
            new Error("you already created a review before")
          );
        }
      })
    ),
  validationMiddleware,
];

export const updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id")
    .custom((val, { req }) =>
      //check review ownership before update
      ReviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("There's no review with this id"));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to perform this action")
          );
        }
      })
    ),
  validationMiddleware,
];
export const deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) => {
      // Check review ownership before update
      if (req.user.role === "user") {
        return ReviewModel.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`)
            );
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        });
      }
      return true;
    }),
  validationMiddleware,
];
