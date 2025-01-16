// import slugify from "slugify";
// import asyncHandler from "express-async-handler";
// import ApiError from "../utils/apiError.js";
// import ApiFeatures from "../utils/apiFeatures.js";
import { SubCategoryModel } from "../models/subCategoryModel.js";
import handlerFactory from "./handlerFactory.js";

export const setCategoryIdToBody = (req, res, next) => {
  //nested route (create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//Nested route
//GET  /api/v1/categories/:categoryId/subcategories
export const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};

// @desc        Create Sub Category
// @route       POST /api/v1/subcategories
// @access      Private
export const createSubCategory = handlerFactory.createOne(SubCategoryModel);
/*
export const createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});*/

// @desc        Get list of subcategories
// @route       GWT /api/v1/subcategories
// @access      Public
export const getSubCategories = handlerFactory.getAll(
  SubCategoryModel,
  "SubCategories"
);
/*
export const getSubCategories = asyncHandler(async (req, res) => {
  const documentsCounts = await SubCategoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategoryModel.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search("SubCategories")
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;
  const subcategories = await mongooseQuery;
  // .populate({ path: "category", select: "name _id" });
  res.status(200).json({
    results: subcategories.length,
    paginationResult,
    data: subcategories,
  });
});*/

// @desc        Get specific subcategory by id
// @route       GWT /api/v1/subcategories/:id
// @access      Public
export const getSubCategoryById = handlerFactory.getOneById(SubCategoryModel);
/*
export const getSubCategoryById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const subcategory = await SubCategoryModel.findById(id);
  // .populate({
  //   path: "category",
  //   select: "name _id",
  // });
  if (!subcategory) {
    return next(new ApiError(`No category found for this id: ${id}`, 404));
  }

  res.status(200).json({
    data: subcategory,
  });
});*/

// @desc        Update specific subcategory
// @route       PUT /api/v1/subcategories/:id
// @access      Private

export const updateSubCategory = handlerFactory.updateOne(SubCategoryModel);

/*
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { name, category } = req.body;
  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true } //to return category after update not before, if this doesn't exist it will return the category before update
  );
  if (!subCategory) {
    return next(new ApiError(`No subcategory found for this id: ${id}`, 404));
  }

  res.status(201).json({ data: subCategory });
});*/

// @desc        Delete specific subcategory
// @route       PUT /api/v1/subcategories/:id
// @access      Private
export const deleteSubCategory = handlerFactory.deleteOne(SubCategoryModel);
// export const deleteSubCategory = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const subCategory = await SubCategoryModel.findByIdAndDelete(id);
//   if (!subCategory) {
//     return next(new ApiError(`No subcategory found for this id: ${id}`, 404));
//   }

//   res.status(204).send();
// });
