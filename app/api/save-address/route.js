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

    if (!address || !address.pincode || !address.fullAddress) {
      return NextResponse.json(
        { error: "Invalid address. Pincode and full address are required" }, 
        { status: 400 }
      );
    }

    // Find existing user by googleId or email
    let user = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { googleId }] 
    });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        googleId,
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        photo: photo || null,
        addresses: [address]
      });
    } else {
      // Update existing user if new data is provided
      if (name && name !== user.name) user.name = name;
      if (photo && !user.photo) user.photo = photo;
      
      // Update or replace first address (or add new one)
      if (user.addresses && user.addresses.length > 0) {
        // Update the most recent address
        user.addresses[0] = address;
      } else {
        user.addresses.push(address);
      }
    }

    await user.save();

    return NextResponse.json({ 
      success: true,
      message: "Address saved successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        addresses: user.addresses
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Save address error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return NextResponse.json(
        { 
          error: `User with this ${field === 'email' ? 'email' : 'Google ID'} already exists`,
          details: `A user with ${field} '${value}' already exists.`
        }, 
        { status: 409 }
      );
    }

    // Handle validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: messages.join(', ') }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}