import crypto from "crypto";
import Order from "../../models/order";
import { dbConnect } from "../../utils/mongoose";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    // ── 1. Verify Razorpay signature ────────────────────────────────────────
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid signature" }),
        { status: 400 }
      );
    }

    // ── 2. Signature is valid → tell the frontend to proceed ────────────────
    // Order saving is handled separately by /api/placeorder (called by the
    // frontend after this verification succeeds). Nothing is saved here.
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Verification error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Verification failed" }),
      { status: 500 }
    );
  }
}