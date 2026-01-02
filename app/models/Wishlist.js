// models/Wishlist.js
import { Schema, model, models } from "mongoose";

const wishlistSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Ensure one wishlist item per user per product
wishlistSchema.index(
  { userEmail: 1, productId: 1 },
  { unique: true }
);

export default models.Wishlist || model("Wishlist", wishlistSchema);
