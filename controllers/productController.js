// import slugify from "slugify";
// import ApiFeatures from "../utils/apiFeatures.js";
// import ApiError from "../utils/apiError.js";
import sharp from "sharp";
import asyncHandler from "express-async-handler";
import handlerFactory from "./handlerFactory.js";
import { uploadMixOfImages } from "../middlewares/uploadImageMiddleware.js";
import { ProductModel } from "../models/productModel.js";

export const uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

export const resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${Date.now()}-cover.webp`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("webp")
      .webp({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${Date.now()}-${index + 1}.webp`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("webp")
          .webp({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

// @desc        Get list of products
// @route       GWT /api/v1/products
// @access      Public
export const getProducts = handlerFactory.getAll(ProductModel, "Products");
/*
export const getProducts = asyncHandler(async (req, res) => {
  const documentsCounts = await ProductModel.countDocuments();
  const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search("Products")
    .limitFields()
    .sort();
  // .populate({ path: "category", select: "name _id" });

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const products = await mongooseQuery;

  res.status(200).json({
    results: products.length,
    paginationResult,
    data: products,
  });
});
*/
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
export const getProductById = handlerFactory.getOneById(ProductModel);
/*
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
});*/

// @desc        Create product
// @route       POST /api/v1/products
// @access      Private
export const createProduct = handlerFactory.createOne(ProductModel);
/*
export const createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await ProductModel.create(req.body);
  res.status(201).json({ data: product });
});*/

// @desc        Update specific product
// @route       PUT /api/v1/products/:id
// @access      Private

export const updateProduct = handlerFactory.updateOne(ProductModel);

/*
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
});*/

// @desc        Delete specific product
// @route       PUT /api/v1/products/:id
// @access      Private
export const deleteProduct = handlerFactory.deleteOne(ProductModel);
// export const deleteProduct = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const product = await ProductModel.findByIdAndDelete(id);
//   if (!product) {
//     return next(new ApiError(`No product found for this id: ${id}`, 404));
//   }

//   res.status(204).send();
// });
