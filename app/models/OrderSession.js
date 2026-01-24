import { Schema, model, models } from "mongoose";

const orderSessionSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  orderData: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "payment_pending", "completed", "cancelled"],
  },
  razorpayOrderId: {
    type: String,
    default: null,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index for automatic deletion
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create TTL index for automatic cleanup
orderSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default models.OrderSession || model("OrderSession", orderSessionSchema);