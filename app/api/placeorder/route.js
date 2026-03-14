import { dbConnect } from "../../utils/mongoose";
import Order from "../../models/order";
import { NextResponse } from "next/server";

// ── Telegram notification ──────────────────────────────────────────────────
async function sendTelegramNotification(orderData) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("Telegram credentials missing — skipping notification");
    return;
  }

  const { name, email, address, items, orderId, subtotal, shippingCharge, total, method } = orderData;

  // ── Build item lines ───────────────────────────────────────────────────────
  const itemLines = items
    .map((item, i) => {
      const size = item.size && item.size !== "Not Applicable" ? item.size : "—";
      return (
        `  ${i + 1}. *${item.productName || item.id}*\n` +
        `     Qty: ${item.quantity}  |  Size: ${size}\n` +
        `     Price: ₹${item.price?.toLocaleString("en-IN") || "—"}`
      );
    })
    .join("\n\n");

  // ── Format full address ────────────────────────────────────────────────────
  const fullAddress = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  // ── Message caption ────────────────────────────────────────────────────────
  const caption =
    `🛍️ *NEW ORDER — Ruveri Jewel*\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `📦 *Order ID:* \`${orderId}\`\n` +
    `💳 *Payment:* ${method === "prepaid" ? "✅ Paid Online" : "🕐 COD"}\n\n` +
    `👤 *Customer*\n` +
    `   Name: ${name}\n` +
    `   Email: ${email}\n\n` +
    `📍 *Delivery Address*\n` +
    `   ${fullAddress}\n\n` +
    `🛒 *Items Ordered*\n\n` +
    `${itemLines}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `🧾 Subtotal:      ₹${subtotal?.toLocaleString("en-IN")}\n` +
    `🚚 Shipping:      ${shippingCharge > 0 ? `₹${shippingCharge}` : "Free"}\n` +
    `💰 *Grand Total: ₹${total?.toLocaleString("en-IN")}*\n` +
    `━━━━━━━━━━━━━━━━━━━━━`;

  try {
    // ── Send one photo per item (first item's image as the lead photo) ───────
    // If any item has an image, send it as a photo with the caption.
    // Otherwise fall back to a plain text message.
    const firstItemWithImage = items.find((item) => item.image);

    if (firstItemWithImage?.image) {
      // Send lead photo with full caption
      const photoRes = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            photo: firstItemWithImage.image,
            caption,
            parse_mode: "Markdown",
          }),
        }
      );

      if (!photoRes.ok) {
        // If photo send fails (e.g. Telegram can't fetch the image URL),
        // fall back to sending a plain text message
        const errData = await photoRes.json();
        console.warn("Telegram photo send failed, falling back to text:", errData.description);
        throw new Error("photo_failed");
      }

      // If there are multiple items, send remaining images as a media group
      const additionalImages = items
        .slice(1)
        .filter((item) => item.image)
        .map((item) => ({
          type: "photo",
          media: item.image,
          caption: item.productName || "",
        }));

      if (additionalImages.length > 0) {
        await fetch(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendMediaGroup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              media: additionalImages,
            }),
          }
        );
      }
    } else {
      throw new Error("no_image");
    }
  } catch {
    // Fallback: send as plain text message
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: caption,
        parse_mode: "Markdown",
      }),
    });
  }
}

// ── Main handler ───────────────────────────────────────────────────────────
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
      subtotal,
      shippingCharge,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = await req.json();

    if (!name || !email || !address || !items || !method || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── Generate order ID using IST timestamp ──────────────────────────────
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
      Math.floor(Math.random() * 10000);

    const paymentStatus = method === "COD" ? "pending" : "completed";

    // ── Build items array ──────────────────────────────────────────────────
    const orderItems = items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      amount: total,
      size: item.size && item.size.trim() !== "" ? item.size.trim() : "Not Applicable",
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

    // ── Save order ─────────────────────────────────────────────────────────
    const existingOrder = await Order.findOne({ email });

    if (existingOrder) {
      existingOrder.items.push(...orderItems);
      existingOrder.name = name;
      await existingOrder.save();
    } else {
      await Order.create({ name, email, items: orderItems });
    }

    // ── Send Telegram notification (non-blocking — never fails the order) ──
    sendTelegramNotification({
      name,
      email,
      address,
      items,       // original items array from frontend (has image, productName, size, price)
      orderId,
      subtotal,
      shippingCharge,
      total,
      method,
    }).catch((err) => console.error("Telegram notification error:", err));

    return NextResponse.json(
      { message: "Order placed successfully", orderId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order Submission Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}