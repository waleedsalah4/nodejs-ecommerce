import mongoose from "mongoose";
import { ProductModel } from "./productModel.js";

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Rating must be above or equal to 1"],
      max: [5, "Rating must be below or equal to 5"],
      required: [true, "rating is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    // parent reference (one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name _id",
  });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    // stage 1 : get all reviews in specific product
    { $match: { product: productId } },
    // stage2: Grouping reviews based on productId and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: "$product", // Group by product ID (for that data got from stage one)
        avgRatings: { $avg: "$ratings" }, // Calculate average rating (for that data got from stage one)
        ratingsQuantity: { $sum: 1 }, // Count the number of reviews
      },
    },
  ]);

  if (result.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
    console.log("we finished here");
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  await mongoose.model("Review").calcAverageRatingsAndQuantity(doc.product);

  /*
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
  this gives error because:
  In the "findOneAndDelete" middleware, this refers to the query object, not the document model. That's why this.constructor.calcAverageRatingsAndQuantity is undefined. However, in the "save" middleware, this refers to the document being saved, which is why it works there.
  */
});

export const ReviewModel = mongoose.model("Review", reviewSchema);
