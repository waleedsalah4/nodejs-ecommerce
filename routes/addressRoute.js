import express from "express";

import {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} from "../controllers/addressController.js";

import { protect, allowedTo } from "../controllers/authController.js";

const router = express.Router();

router.use(protect, allowedTo("user"));

router.route("/").post(addAddress).get(getLoggedUserAddresses);
router.delete("/:addressId", removeAddress);

export default router;
