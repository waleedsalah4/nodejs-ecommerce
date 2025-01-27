import bcrypt from "bcryptjs";
import sharp from "sharp";
import asyncHandler from "express-async-handler";

import ApiError from "../utils/apiError.js";
import handlerFactory from "./handlerFactory.js";
import User from "../models/userModal.js";

import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";

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

export const updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(
      new ApiError(`No document found for this id: ${req.params.id}`, 404)
    );
  }

  res.status(201).json({ data: document });
});

export const changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc        Delete specific User
// @route       PUT /api/v1/users/:id
// @access      Private

export const deleteUser = handlerFactory.deleteOne(User);
