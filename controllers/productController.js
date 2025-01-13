import slugify from "slugify";
import asyncHandler from "express-async-handler";
import { ProductModel } from "../models/productModel.js";
import ApiError from "../utils/apiError.js";

// @desc        Get list of products
// @route       GWT /api/v1/products
// @access      Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const totalItems = await ProductModel.find().countDocuments();
  const products = await ProductModel.find({})
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name _id" });
  res.status(200).json({
    results: products.length,
    totalCount: totalItems,
    page: page,
    data: products,
  });
});

// @desc        Get specific product by id
// @route       GWT /api/v1/products/:id
// @access      Public
export const getProductById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const product = await ProductModel.findById(id).populate({
    path: "category",
    select: "name _id",
  });
  if (!product) {
    return next(new ApiError(`No product found for this id: ${id}`, 404));
  }

  res.status(200).json({
    data: product,
  });
});

// @desc        Create product
// @route       POST /api/v1/products
// @access      Private
export const createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await ProductModel.create(req.body);
  res.status(201).json({ data: product });
});

// @desc        Update specific product
// @route       PUT /api/v1/products/:id
// @access      Private
export const updateProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await ProductModel.findByIdAndUpdate(
    { _id: id },
    req.body,
    { new: true } //to return product after update not before, if this doesn't exist it will return the product before update
  );
  if (!product) {
    return next(new ApiError(`No product found for this id: ${id}`, 404));
  }

  res.status(201).json({ data: product });
});

// @desc        Delete specific product
// @route       PUT /api/v1/products/:id
// @access      Private
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`No product found for this id: ${id}`, 404));
  }

  res.status(204).send();
});
