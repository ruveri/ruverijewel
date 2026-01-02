import { NextResponse } from "next/server";
import { dbConnect } from "../../utils/mongoose";
import Wishlist from "../../models/Wishlist";

/* -------------------- ADD TO WISHLIST -------------------- */
export async function POST(req) {
  try {
    await dbConnect();
    const { userEmail, productId } = await req.json();

    if (!userEmail || !productId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const exists = await Wishlist.findOne({ userEmail, productId });
    if (exists) {
      return NextResponse.json(
        { message: "Already in wishlist" },
        { status: 200 }
      );
    }

    const wishlist = await Wishlist.create({ userEmail, productId });

    return NextResponse.json(
      { message: "Added to wishlist", wishlist },
      { status: 201 }
    );
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


/* -------------------- REMOVE FROM WISHLIST -------------------- */
export async function DELETE(req) {
  try {
    await dbConnect();
    const { userEmail, productId } = await req.json();

    if (!userEmail || !productId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await Wishlist.deleteOne({ userEmail, productId });

    if (!result.deletedCount) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Removed from wishlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


/* -------------------- GET USER WISHLIST -------------------- */
export async function GET(req) {
  try {
    await dbConnect();
    const userEmail = req.nextUrl.searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email required" },
        { status: 400 }
      );
    }

    const wishlist = await Wishlist.find({ userEmail });

    return NextResponse.json(
      { wishlist },
      { status: 200 }
    );
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

