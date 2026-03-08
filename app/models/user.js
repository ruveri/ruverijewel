import { Schema, model, models } from "mongoose";

const addressSchema = new Schema({
  pincode: String,
  city: String,
  state: String,
  fullAddress: String,
  country: {
    type: String,
    required: true,
    uppercase: true,
    default: "IN",
  },
  phone: {
    type: String,
    trim: true,
    default: "",
  },
}, { _id: false });

const userSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  photo: {
    type: String,
    default: null,
  },
  addresses: {
    type: [addressSchema],
    default: [],
  },
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

export default models.User || model("User", userSchema);