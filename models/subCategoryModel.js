import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "subCategory must be unique"],
      minLength: [2, "Too short category name"],
      maxLength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Sub category must belong to a parent category"],
    },
  },
  { timestamps: true }
);

export const SubCategoryModel = mongoose.model(
  "SubCategory",
  subCategorySchema
);
