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
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} from "../controllers/userController.js";
import {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  deleteUserValidator,
  updateLoggedUserValidator,
} from "../utils/validators/userValidator.js";
import { protect, allowedTo } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.get("/getMe", getLoggedUserData, getUserById);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

router.use(allowedTo("admin", "manager"));
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
