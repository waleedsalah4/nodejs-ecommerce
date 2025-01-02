import slugify from "slugify";
import asyncHandler from "express-async-handler";
import { CategoryModel } from "../models/categoryModel.js";
import ApiError from "../utils/apiError.js";

// @desc        Get list of categories
// @route       GWT /api/v1/categories
// @access      Public
export const getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const totalItems = await CategoryModel.find().countDocuments();
  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({
    results: categories.length,
    totalCount: totalItems,
    page: page,
    data: categories,
  });
});

// @desc        Get specific category by id
// @route       GWT /api/v1/categories/:id
// @access      Public
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new ApiError(`No category found for this id: ${id}`, 404));
  }

  res.status(200).json({
    data: category,
  });
});

// @desc        Create category
// @route       POST /api/v1/categories
// @access      Private
export const createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @desc        Update specific category
// @route       PUT /api/v1/categories/:id
// @access      Private
export const updateCategory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const category = await CategoryModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true } //to return category after update not before, if this doesn't exist it will return the category before update
  );
  if (!category) {
    return next(new ApiError(`No category found for this id: ${id}`, 404));
  }

  res.status(201).json({ data: category });
});

// @desc        Delete specific category
// @route       PUT /api/v1/categories/:id
// @access      Private
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`No category found for this id: ${id}`, 404));
  }

  res.status(204).send();
});

/*
export const createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  async-await
  //   try {
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
  //   } catch (err) {
  //     res.status(400).send(err);
  //   }

  remove try-catch when using asyncHandler (it catches the error an pass it to your  express error handlers)
  ----------
  
  then-catch

  CategoryModel.create({ name, slug: slugify(name) })
    .then((category) => {
      res.status(201).json({ data: category });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

*/
