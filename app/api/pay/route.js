import Razorpay from "razorpay";
import { dbConnect } from "../../utils/mongoose";
import Product from "../../models/product";

/* ── Purity multipliers ──────────────────────────────────────────────────── */
const getPurityMultiplier = (metal, purity) => {
  const goldMap = {
    "24K": 1,
    "22K": 0.916,
    "20K": 0.833,
    "18K": 0.78,
    "14K": 0.615,
    "9K": 0.415,
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

/* ── Price calculator (single source of truth) ───────────────────────────── */
const calcUnitPrice = (product) => {
  // Silver: metalPrice IS the final price
  if (product.metal === "silver") {
    return Number(product.metalPrice) || 0;
  }

  // Gold: standard formula
  const netWeight        = Number(product.netWeight)     || 0;
  const metalPrice       = Number(product.metalPrice)    || 0;
  const makingCharges    = Number(product.makingCharges) || 0;
  const diamondPrice     = Number(product.diamondPrice)  || 0;
  const purityMultiplier = getPurityMultiplier(product.metal, product.purity);

  return Math.ceil(netWeight * metalPrice * purityMultiplier + makingCharges + diamondPrice);
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { items, shippingCharge = 0 } = body;

    await dbConnect();

    // ── Calculate subtotal from DB prices (never trust client) ─────────────
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.id).lean();

      if (!product) {
        return new Response(
          JSON.stringify({
            success: false,
            message: `Product not found: ${item.id}`,
          }),
          { status: 400 }
        );
      }

      subtotal += calcUnitPrice(product) * item.quantity;
    }

    // ── Validate shipping charge ────────────────────────────────────────────
    const shipping = Number(shippingCharge);
    if (isNaN(shipping) || shipping < 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid shipping charge.",
        }),
        { status: 400 }
      );
    }

    // ── Grand total = subtotal + shipping. No discounts. ───────────────────
    const grandTotal = subtotal + shipping;

    if (grandTotal <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid total. Order amount must be greater than zero.",
        }),
        { status: 400 }
      );
    }

    // ── Create Razorpay order ───────────────────────────────────────────────
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: grandTotal * 100, // paise
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
        error: error.message,
      }),
      { status: 500 }
    );
  }
}