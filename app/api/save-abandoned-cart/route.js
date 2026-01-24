// /app/api/save-abandoned-cart/route.js

import { dbConnect } from "../../utils/mongoose";
import AbandonedCart from "../../models/AbandonedCart"; // Define this schema

export async function POST(req) {
  await dbConnect();
  const { name, phone, cart } = await req.json();

  if (!phone || !Object.keys(cart).length) {
    return new Response("Invalid data", { status: 400 });
  }

  await AbandonedCart.create({ name, phone, cart, createdAt: new Date() });

  return new Response("Saved", { status: 200 });
}