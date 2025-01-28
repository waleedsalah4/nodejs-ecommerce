import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

import ApiError from "../utils/apiError.js";
import User from "../models/userModal.js";
import { createToken } from "../utils/createToken.js";

// @desc        signup
// @route       GWT /api/v1/auth/signup
// @access      Public
export const signup = asyncHandler(async (req, res, next) => {
  // 1- create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // 2- generate token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

// @desc        login
// @route       GWT /api/v1/auth/signup
// @access      Public
export const login = asyncHandler(async (req, res, next) => {
  // 1- check if password and email in the body(validation)
  //2- check if user exist & check if password is correct
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  // 2- generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;

  //4- send password to client
  res.status(200).json({ data: user, token });
});
