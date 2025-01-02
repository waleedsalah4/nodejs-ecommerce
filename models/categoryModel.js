import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category is required"],
      unique: [true, "Category must be unique"],
      minLength: [3, "Too short category name"],
      maxLength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.model("Category", categorySchema);
