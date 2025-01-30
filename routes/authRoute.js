import express from "express";

import {
  login,
  signup,
  forgotPassword,
  VerifyResetCode,
  resetPassword,
} from "../controllers/authController.js";
import {
  loginValidator,
  signupValidator,
} from "../utils/validators/authValidator.js";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", VerifyResetCode);
router.put("/resetPassword", resetPassword);

export default router;
