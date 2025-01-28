import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
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

export const protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }
  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }
  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changes after token created (error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "user recently changes his password, please login again",
          401
        )
      );
    }
  }

  req.user = currentUser;

  next();
});
