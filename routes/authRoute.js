import express from "express";

import { login, signup } from "../controllers/authController.js";
import {
  loginValidator,
  signupValidator,
} from "../utils/validators/authValidator.js";

const router = express.Router();

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
// router
//   .route("/:id")
//   .get(getUserValidator, getUserById)
//   .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

export default router;
