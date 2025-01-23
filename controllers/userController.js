// import slugify from "slugify";
// import ApiFeatures from "../utils/apiFeatures.js";
import asyncHandler from "express-async-handler";
import sharp from "sharp";
import ApiError from "../utils/apiError.js";
import handlerFactory from "./handlerFactory.js";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";
import User from "../models/userModal.js";

// Upload single image
export const uploadUserImage = uploadSingleImage("profileImg");
// Image processing
export const resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    // return next(new ApiError("No file uploaded", 400));

    const fileName = `user-${Date.now()}-${req.file.originalname.split(".")[0]}.webp`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("webp")
      .webp({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);

    //to save the image path in db
    req.body.profileImg = fileName;
  }
  next();
});

// @desc        Get list of users
// @route       GWT /api/v1/users
// @access      Private
export const getUsers = handlerFactory.getAll(User, "Users");

// @desc        Get specific User by id
// @route       GWT /api/v1/users/:id
// @access      Private
export const getUserById = handlerFactory.getOneById(User);

// @desc        Create User
// @route       POST /api/v1/users
// @access      Private

export const createUser = handlerFactory.createOne(User);

// @desc        Update specific User
// @route       PUT /api/v1/users/:id
// @access      Private

export const updateUser = handlerFactory.updateOne(User);

// @desc        Delete specific User
// @route       PUT /api/v1/users/:id
// @access      Private

export const deleteUser = handlerFactory.deleteOne(User);
