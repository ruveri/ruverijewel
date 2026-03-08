import { dbConnect } from "../../utils/mongoose";
import User from "../../models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { email, address, name, photo, googleId } = await req.json();

    // Validate required fields
    if (!email || !googleId) {
      return NextResponse.json(
        { error: "Email and Google ID are required" },
        { status: 400 }
      );
    }

    if (!address || !address.pincode || !address.fullAddress || !address.country) {
      return NextResponse.json(
        { error: "Invalid address. Pincode, full address, and country are required" },
        { status: 400 }
      );
    }

    // ── Phone validation ──────────────────────────────────────────────────────
    if (!address.phone || !address.phone.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const phoneDigits = address.phone.replace(/\D/g, "");
    if (address.country === "IN" && phoneDigits.length !== 10) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit mobile number for Indian orders" },
        { status: 400 }
      );
    }
    if (address.country !== "IN" && phoneDigits.length < 7) {
      return NextResponse.json(
        { error: "Enter a valid international phone number" },
        { status: 400 }
      );
    }

    // Ensure country code is uppercase
    address.country = address.country.toUpperCase();
    address.phone = address.phone.trim();

    // Find existing user by googleId or email
    let user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { googleId }],
    });

    if (!user) {
      user = new User({
        googleId,
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        photo: photo || null,
        addresses: [address],
      });
    } else {
      if (name && name !== user.name) user.name = name;
      if (photo && !user.photo) user.photo = photo;

      if (user.addresses && user.addresses.length > 0) {
        user.addresses[0] = address;
      } else {
        user.addresses.push(address);
      }
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Address saved successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
          addresses: user.addresses,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Save address error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return NextResponse.json(
        {
          error: `User with this ${field === "email" ? "email" : "Google ID"} already exists`,
          details: `A user with ${field} '${value}' already exists.`,
        },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}