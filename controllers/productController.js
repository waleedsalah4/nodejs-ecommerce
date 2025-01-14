import slugify from "slugify";
import asyncHandler from "express-async-handler";
import { ProductModel } from "../models/productModel.js";
import ApiError from "../utils/apiError.js";

// @desc        Get list of products
// @route       GWT /api/v1/products
// @access      Public
export const getProducts = asyncHandler(async (req, res) => {
  // 1) Filtering
  const queryStringObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
  excludedFields.forEach((el) => delete queryStringObj[el]);

  //if we want to filter with values of greater then or equal we have to do this
  // {price: {$gte: 50}, ratingsAverage: {$gte: 4}}
  //console.log(queryStringObj); //{ ratingsAverage: { gte: '4.3' } }
  //we don't get the "$" sign so we need to add it

  // 1.1) Advanced filtering
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt|ne)\b/g,
    (match) => `$${match}`
  );

  // 2) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  // const totalItems = await ProductModel.find().countDocuments();

  //build query
  let mongooseQuery = ProductModel.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name _id" });

  // 3) Sorting
  if (req.query.sort) {
    //price || -price
    //mongooseQuery = mongooseQuery.sort(req.query.sort);

    //in case we need to to sort with more than one value
    // we set the value in postman like this sort=price,sold
    // but this "price,sold" won't work we need to remove the "," as sort work like this => sort('price sold')
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }

  // 4) Limiting fields
  if (req.query.fields) {
    // title,ratingAverage,imageCover,price
    const fields = req.query.fields.split(",").join(" ");
    // title ratingAverage imageCover price
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v"); //exclude "__v"
    // when you but '-' before field you eliminate it
  }

  // 5) Search
  if (req.query.keyword) {
    console.log(req.query);
    const keyword = req.query.keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    let query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    //$options: "i" make it the same incase i write "men" or "MEN" not case sensitive
    mongooseQuery = mongooseQuery.find(query);
    // search in all products title and description that may have this keyword and return these products
  }

  // Execute query
  const products = await mongooseQuery;

  res.status(200).json({
    results: products.length,
    // totalCount: totalItems,
    page: page,
    data: products,
  });
});

/*
  without await your only building your query
  with it your are executing it
*/

/**
 to apply filter we have two ways
 1-
  await ProductModel.find({
    price: req.query.price,
    ratingAverage: req.query.ratingAverage
  })
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name _id" });
    
----
  2-
  chain methods
  await ProductModel.find({})
    .where('price').equals(req.query.price)
    .where("ratingAverage").equals(req.query.ratingAverage)
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name _id" });


 */

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
