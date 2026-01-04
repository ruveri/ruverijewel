// models/Review.js
import { Schema, model, models } from "mongoose";

const reviewSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userPhoto: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per user per product
reviewSchema.index({ productId: 1, userEmail: 1 }, { unique: true });

export default models.Review || model("Review", reviewSchema);