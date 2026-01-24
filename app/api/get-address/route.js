import { NextResponse } from "next/server";
import { dbConnect } from "../../utils/mongoose";
import User from "../../models/user";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const googleId = searchParams.get("googleId");

    if (!email && !googleId) {
      return NextResponse.json(
        { 
          success: false,
          error: "Email or Google ID is required" 
        }, 
        { status: 400 }
      );
    }

    await dbConnect();

    // Build query
    const query = {};
    if (email) query.email = email.toLowerCase();
    if (googleId) query.googleId = googleId;

    const user = await User.findOne(query).lean();

    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: "User not found",
          address: null,
          email: null
        }, 
        { status: 404 }
      );
    }

    // Get most recent address
    const latestAddress = user.addresses?.length > 0 
      ? user.addresses[user.addresses.length - 1] 
      : null;

    return NextResponse.json({
      success: true,
      address: latestAddress,
      user: {
        email: user.email,
        name: user.name,
        photo: user.photo,
        googleId: user.googleId,
        addressCount: user.addresses?.length || 0
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("Get address error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error" 
      }, 
      { status: 500 }
    );
  }
}