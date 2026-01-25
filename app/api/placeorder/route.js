import { dbConnect } from "../../utils/mongoose";
import Order from "../../models/order";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { 
      name, 
      email, 
      address, 
      items, 
      method,
      total,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = await req.json();

    if (!name || !email || !address || !items || !method || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate order ID using timestamp
    const nowUTC = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(nowUTC.getTime() + istOffset);

    const pad = (n) => n.toString().padStart(2, "0");

    const orderId =
      pad(nowIST.getDate()) +
      pad(nowIST.getMonth() + 1) +
      nowIST.getFullYear() +
      pad(nowIST.getHours()) +
      pad(nowIST.getMinutes()) +
      pad(nowIST.getSeconds()) +
      Math.floor(Math.random() * 10000); // Random number for uniqueness

    // Determine payment status
    const paymentStatus = method === "COD" ? "pending" : "completed";

    // Build items array
    const orderItems = items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      amount: item.price * item.quantity, // Individual item total
      method,
      pincode: address.pincode,
      city: address.city,
      state: address.state,
      fullAddress: address.line1,
      orderId,
      razorpayOrderId: method === "prepaid" ? (razorpayOrderId || null) : null,
      razorpayPaymentId: method === "prepaid" ? (razorpayPaymentId || null) : null,
      razorpaySignature: method === "prepaid" ? (razorpaySignature || null) : null,
      paymentStatus,
      createdAt: nowIST,
    }));

    // Create or update order based on email
    const existingOrder = await Order.findOne({ email });

    if (existingOrder) {
      // Add new items to existing customer order
      existingOrder.items.push(...orderItems);
      existingOrder.name = name;
      await existingOrder.save();
    } else {
      // Create new order
      await Order.create({
        name,
        email,
        items: orderItems,
      });
    }

    return NextResponse.json({ 
      message: "Order placed successfully", 
      orderId 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Order Submission Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error.message 
    }, { status: 500 });
  }
}