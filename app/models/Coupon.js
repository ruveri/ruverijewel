import { Schema, model, models } from "mongoose";

const couponSchema = new Schema({
  couponCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  discountAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  orderId: {
    type: String,
    required: true,
  },
  usedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Create indexes
couponSchema.index({ userEmail: 1, couponCode: 1 }, { unique: false });
couponSchema.index({ couponCode: 1 });

export default models.Coupon || model("Coupon", couponSchema);