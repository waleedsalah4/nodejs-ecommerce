import slugify from "slugify";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import { BrandModel } from "../models/brandModel.js";

// @desc        Get list of brands
// @route       GWT /api/v1/brands
// @access      Public
export const getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const totalItems = await BrandModel.find().countDocuments();
  const brands = await BrandModel.find({}).skip(skip).limit(limit);
  res.status(200).json({
    results: brands.length,
    totalCount: totalItems,
    page: page,
    data: brands,
  });
});

// @desc        Get specific brand by id
// @route       GWT /api/v1/brands/:id
// @access      Public
export const getBrandById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const brand = await BrandModel.findById(id);
  if (!brand) {
    return next(new ApiError(`No brand found for this id: ${id}`, 404));
  }

  res.status(200).json({
    data: brand,
  });
});

// @desc        Create brand
// @route       POST /api/v1/brands
// @access      Private
export const createBrand = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const brand = await BrandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

// @desc        Update specific brand
// @route       PUT /api/v1/brands/:id
// @access      Private
export const updateBrand = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const brand = await BrandModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true } //to return brand after update not before, if this doesn't exist it will return the brand before update
  );
  if (!brand) {
    return next(new ApiError(`No brand found for this id: ${id}`, 404));
  }

  res.status(201).json({ data: brand });
});

// @desc        Delete specific brand
// @route       PUT /api/v1/brands/:id
// @access      Private
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const brand = await BrandModel.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`No brand found for this id: ${id}`, 404));
  }

  res.status(204).send();
});
