import express from "express";

import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
} from "../controllers/userController.js";
import {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  deleteUserValidator,
} from "../utils/validators/userValidator.js";

const router = express.Router();

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUserById)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

export default router;
