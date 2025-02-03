import handlerFactory from "./handlerFactory.js";
import { ReviewModel } from "../models/reviewModel.js";

export const setProductIdAndUserIdToBody = (req, res, next) => {
  //nested route (create)
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

//Nested route
//GET  /api/v1/products/:productId/reviews
export const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObject = filterObject;
  next();
};

// @desc        Get list of reviews
// @route       GWT /api/v1/reviews
// @access      Public
export const getReviews = handlerFactory.getAll(ReviewModel, "Reviews");

// @desc        Get specific brand by id
// @route       GWT /api/v1/reviews/:id
// @access      Public
export const getReviewById = handlerFactory.getOneById(ReviewModel);

// @desc        Create Review
// @route       POST /api/v1/reviews
// @access      Private/Protect/User

export const createReview = handlerFactory.createOne(ReviewModel);

// @desc        Update specific Review
// @route       PUT /api/v1/reviews/:id
// @access      Private/Protect/User

export const updateReview = handlerFactory.updateOne(ReviewModel);

// @desc        Delete specific Review
// @route       PUT /api/v1/reviews/:id
// @access      Private/Protect/User-Admin-Manager

export const deleteReview = handlerFactory.deleteOne(ReviewModel);
