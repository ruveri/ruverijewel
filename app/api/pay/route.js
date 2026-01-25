import Razorpay from "razorpay";
import { dbConnect } from "../../utils/mongoose";
import Product from '../../models/product';

/* ------------------ PURITY MULTIPLIERS ------------------ */
const getPurityMultiplier = (metal, purity) => {
  const goldMap = {
    "24K": 1,
    "22K": 0.916,
    "20K": 0.833,
    "18K": 0.75,
    "14K": 0.585,
  };

  const silverMap = {
    "999 Silver": 1,
    "950 Silver": 0.95,
    "925 Silver": 0.925,
    "900 Silver": 0.9,
    "800 Silver": 0.8,
  };

  if (metal === "gold") return goldMap[purity] || 1;
  if (metal === "silver") return silverMap[purity] || 1;

  return 1;
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { items, discountAmount = 0 } = body;

    await dbConnect();

    let subtotal = 0;

    // Fetch real prices from DB and calculate correctly
    for (const item of items) {
      const product = await Product.findById(item.id).lean();
      if (!product) {
        return new Response(
          JSON.stringify({ success: false, message: `Product not found: ${item.id}` }), 
          { status: 400 }
        );
      }

      // Calculate price using the same logic as fetch API
      const netWeight = Number(product.netWeight) || 0;
      const metalPrice = Number(product.metalPrice) || 0;
      const makingCharges = Number(product.makingCharges) || 0;

      const purityMultiplier = getPurityMultiplier(
        product.metal,
        product.purity
      );

      const totalPrice = Math.ceil(
        netWeight * metalPrice * purityMultiplier + makingCharges
      );

      const quantity = item.quantity;
      subtotal += totalPrice * quantity;
    }

    // Calculate total quantity for discount
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const quantityDiscount = totalQuantity * 100; // ₹100 discount per item
    
    const total = subtotal - quantityDiscount; // Apply both discounts

    if (total <= 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Invalid total. Order amount must be greater than zero." 
        }), 
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: total * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    });

    return new Response(
      JSON.stringify({ success: true, razorpayOrderId: order.id }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Order creation failed",
        error: error.message 
      }),
      { status: 500 }
    );
  }
}