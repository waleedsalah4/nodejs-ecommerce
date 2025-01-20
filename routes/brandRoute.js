import express from "express";

import {
  getBrands,
  createBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} from "../controllers/brandController.js";

import {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} from "../utils/validators/brandValidators.js";

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, resizeImage, createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getBrandById)
  .put(uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

export default router;
