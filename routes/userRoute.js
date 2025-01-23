import express from "express";

import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(getUsers).post(uploadUserImage, resizeImage, createUser);
router
  .route("/:id")
  .get(getUserById)
  .put(uploadUserImage, resizeImage, updateUser)
  .delete(deleteUser);

export default router;
