import { dbConnect } from "../../utils/mongoose";
import User from "../../models/user";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const uid = url.searchParams.get("uid");

    if (!email || !uid) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify uid (Google UID)
    if (user.googleId !== uid) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    return NextResponse.json({
      message: "User verified",
      user: {
        name: user.name,
        email: user.email,
        addresses: user.addresses,
      },
    });
  } catch (err) {
    console.error("Verification Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}