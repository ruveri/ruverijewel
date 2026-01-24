// models/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  photo: { type: String },
  googleId: { type: String },
  
  // Address
  address: {
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    line1: { type: String, required: true },
  },
  
  // Items
  items: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    image: { type: String },
    metal: { type: String },
    purity: { type: String },
    weight: { type: Number },
    engravedName: { type: String },
  }],
  
  // Payment
  paymentMethod: { type: String, enum: ['cod', 'prepaid'], required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  
  // Razorpay fields (for prepaid)
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  
  // Pricing
  subtotal: { type: Number, required: true },
  couponCode: { type: String },
  couponDiscount: { type: Number, default: 0 },
  prepaidDiscount: { type: Number, default: 0 },
  shippingCharge: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);