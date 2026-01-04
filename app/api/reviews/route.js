// app/api/reviews/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "../../utils/mongoose";
import Review from "../../models/review";

// GET reviews for a product
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews", reviews: [] },
      { status: 500 }
    );
  }
}

// POST a new review
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const { productId, userEmail, userName, userPhoto, rating, comment } = body;

    if (!productId || !userEmail || !userName || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userEmail });
    
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
      return NextResponse.json({ review: existingReview });
    }

    // Create new review
    const review = await Review.create({
      productId,
      userEmail,
      userName,
      userPhoto,
      rating,
      comment,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}