// import slugify from "slugify";
// import ApiFeatures from "../utils/apiFeatures.js";
import sharp from "sharp";
import asyncHandler from "express-async-handler";

import handlerFactory from "./handlerFactory.js";
import ApiError from "../utils/apiError.js";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";

import { CategoryModel } from "../models/categoryModel.js";

// Upload single image
export const uploadCategoryImage = uploadSingleImage("image");
// Image processing
export const resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No file uploaded", 400));
  }
  const fileName = `${new Date().toISOString().replace(/:/g, "-")}-${req.file.originalname.split(".")[0]}.webp`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("webp")
    .webp({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);

  //to save the image path in db
  req.body.image = fileName;

  next();
});

// @desc        Get list of categories
// @route       GWT /api/v1/categories
// @access      Public
export const getCategories = handlerFactory.getAll(CategoryModel, "Categories");
/*
export const getCategories = asyncHandler(async (req, res) => {
  const documentsCounts = await CategoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search("Categories")
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;
  res.status(200).json({
    results: categories.length,
    paginationResult,
    data: categories,
  });
});*/

// @desc        Get specific category by id
// @route       GWT /api/v1/categories/:id
// @access      Public
export const getCategoryById = handlerFactory.getOneById(CategoryModel);
/*
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new ApiError(`No category found for this id: ${id}`, 404));
  }

  res.status(200).json({
    data: category,
  });
});*/

// @desc        Create category
// @route       POST /api/v1/categories
// @access      Private
export const createCategory = handlerFactory.createOne(CategoryModel);
/*
export const createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});*/

// @desc        Update specific category
// @route       PUT /api/v1/categories/:id
// @access      Private

export const updateCategory = handlerFactory.updateOne(CategoryModel);

/*
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
*/
// @desc        Delete specific category
// @route       PUT /api/v1/categories/:id
// @access      Private
export const deleteCategory = handlerFactory.deleteOne(CategoryModel);
// export const deleteCategory = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const category = await CategoryModel.findByIdAndDelete(id);
//   if (!category) {
//     return next(new ApiError(`No category found for this id: ${id}`, 404));
//   }

//   res.status(204).send();
// });

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
