import { dbConnect } from "../../utils/mongoose";
import Order from "../../models/order";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const coupon = searchParams.get("coupon");

    if (!email || !coupon) {
      return NextResponse.json(
        { error: "Email and coupon are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if this email has used this coupon before
    const existingOrder = await Order.findOne({
      "items.email": email,
      "items.coupon": coupon
    });

    return NextResponse.json({
      valid: !existingOrder,
      message: existingOrder 
        ? "You've already used this coupon" 
        : "Coupon is valid"
    }, { status: 200 });

  } catch (error) {
    console.error("Coupon check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}