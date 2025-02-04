import asyncHandler from "express-async-handler";
import handlerFactory from "./handlerFactory.js";
import User from "../models/userModal.js";

// @desc        Get specific User by id
// @route       GWT /api/v1/users/:id
// @access      Private
export const getUserById = handlerFactory.getOneById(User);

// @desc        Add product to wishlist
// @route       POST /api/v1/wishlist
// @access      Private/User
export const addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res
    .status(200)
    .json({
      status: "success",
      message: "Product Added successfully to your wishlist",
      data: user.wishlist,
    });
});

// @desc        Delete specific User
// @route       PUT /api/v1/users/:id
// @access      Private

export const deleteUser = handlerFactory.deleteOne(User);
