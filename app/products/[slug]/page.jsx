"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../nopage/context/CartContext";
import ReviewForm from "../../nopage/components/review";
import Checkout from "../../nopage/checkout/checkout";
import { XMarkIcon, HeartIcon as HeartOutline, ShareIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useGoogleAuth } from "../../nopage/components/useGoogleAuth";

/* ---------- PRICE HELPERS ---------- */
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
    "800 Silver": 0.8
  };

  if (metal === "gold") return goldMap[purity] || 1;
  if (metal === "silver") return silverMap[purity] || 1;
  return 1;
};

const calculateTotalPrice = (product) => {
  if (!product) return 0;

  try {
    const netWeight = Number(product.netWeight) || 0;
    const metalPrice = Number(product.metalPrice) || 0;
    const makingCharges = Number(product.makingCharges) || 0;
    const diamondPrice = Number(product.diamondPrice) || 0;
    const purityMultiplier = getPurityMultiplier(product.metal, product.purity);
    return Math.ceil(netWeight * metalPrice * purityMultiplier + makingCharges + diamondPrice);
  } catch (error) {
    console.error("Error calculating price:", error);
    return product.originalPrice || product.totalPrice || 0;
  }
};

/* ---------- PRICE BREAKDOWN COMPONENT ---------- */
const PriceBreakdown = ({ product }) => {
  const [openBreakdown, setOpenBreakdown] = useState(false);

  if (!product) return null;

  const netWeight = Number(product.netWeight) || 0;
  const metalPrice = Number(product.metalPrice) || 0;
  const makingCharges = Number(product.makingCharges) || 0;
  const diamondPrice = Number(product.diamondPrice) || 0;
  const diamondWeight = Number(product.diamondWeight) || 0;
  const purityMultiplier = getPurityMultiplier(product.metal, product.purity);

  // Calculate individual components
  const metalCost = netWeight * metalPrice * purityMultiplier;
  const totalPrice = Math.ceil(metalCost + makingCharges + diamondPrice);

  // Calculate GST (assuming 3% for gold jewelry)
  const gstRate = 0.03; // 3%
  const gstOnMakingCharges = makingCharges * gstRate;
  const makingChargesWithoutGST = makingCharges - gstOnMakingCharges;

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpenBreakdown(!openBreakdown)}
        className="w-full flex justify-between items-center border-t border-b py-4 hover:bg-gray-50 transition-colors"
      >
        <span className="text-base sm:text-lg font-medium">Price Breakdown</span>
        <span className="text-xl sm:text-2xl">{openBreakdown ? "−" : "+"}</span>
      </button>

      {openBreakdown && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <div className="py-6 space-y-4">
            {/* Price Calculation Explanation */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-black mb-3">How we calculate the price:</h4>
              <p className="text-sm text-gray-600 mb-4">
                Total Price = (Net Weight × Metal Price of <strong>pure metal</strong> × Purity Multiplier) + Diamond Price + Making Charges (includes GST)
              </p>
              <p className="text-xs text-gray-500">
                <em>Purity Multiplier converts pure metal price (24K gold / 999 silver) to the actual product purity (e.g., 22K, 18K, 925 silver)</em>
              </p>
            </div>

            {/* Price Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Component
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calculation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Metal Cost Row */}
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">Metal Cost</div>
                      <div className="text-xs text-gray-500">
                        {product.metal.charAt(0).toUpperCase() + product.metal.slice(1)} ({product.purity})
                        <span className="block text-xs text-gray-400">
                          Price shown is for pure {product.metal === "gold" ? "24K gold" : "999 silver"}, converted to {product.purity} using Purity Multiplier ({purityMultiplier})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {netWeight}g × ₹{metalPrice.toLocaleString()}/g × {purityMultiplier} &nbsp;
                      <span className="text-xs text-gray-400">(converts to {product.purity})</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ₹{Math.ceil(metalCost).toLocaleString()}
                    </td>
                  </tr>

                  {/* Diamond Price Row */}
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">Diamond Price</div>
                      <div className="text-xs text-gray-500">
                        {diamondWeight} ct diamonds
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {diamondWeight} ct
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ₹{diamondPrice.toLocaleString()}
                    </td>
                  </tr>

                  {/* Making Charges Row */}
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">Making Charges</div>
                      <div className="text-xs text-gray-500">Including 3% GST</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      Labour + Design + GST
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ₹{makingCharges.toLocaleString()}
                    </td>
                  </tr>

                  {/* GST Breakdown (Detailed) */}
                  <tr className="bg-gray-50">
                    <td colSpan="3" className="px-4 py-3 text-sm text-gray-600">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Making Charges (before GST):</span>
                          <span className="font-medium ml-1">₹{Math.ceil(makingChargesWithoutGST).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">GST @3%:</span>
                          <span className="font-medium ml-1">₹{Math.ceil(gstOnMakingCharges).toLocaleString()}</span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Total Row */}
                  <tr className="bg-gray-100">
                    <td className="px-4 py-3">
                      <div className="text-sm font-bold text-black">Final Price</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      Metal Cost + Making Charges
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-lg font-bold text-black">
                        ₹{totalPrice.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Additional Notes */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h5 className="text-sm font-medium text-blue-800 mb-2">Important Notes:</h5>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Metal price is based on current market rates (updated daily)</li>
                <li>• Making charges include GST as per government regulations</li>
                <li>• Hallmarking charges are included in making charges</li>
                <li>• All prices are in Indian Rupees (₹)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ---------- UPDATED REVIEW FORM ---------- */
const UpdatedReviewForm = ({ productId }) => {
  const { loginWithGoogle, getLoggedInUser } = useGoogleAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);

  useEffect(() => {
    // Fetch existing reviews with better error handling
    fetch(`/api/reviews?productId=${productId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch reviews: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setReviews(data?.reviews || []))
      .catch(error => {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      });
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const user = getLoggedInUser();
    if (!user?.email) {
      setLoginPrompt(true);
      return;
    }

    if (!newReview.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userEmail: user.email,
          userName: user.name,
          userPhoto: user.photo,
          rating,
          comment: newReview,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviews([data.review, ...reviews]);
        setNewReview("");
        setRating(5);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 space-y-8">
      <h2 className="text-2xl font-bold text-black">Customer Reviews</h2>

      {/* Review Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-black mb-4">Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl focus:outline-none"
              >
                <span className={star <= rating ? "text-yellow-500" : "text-gray-300"}>
                  ★
                </span>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">{rating}.0</span>
          </div>

          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Share your thoughts about this product..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent h-32 resize-none"
            maxLength={500}
          />

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {newReview.length}/500 characters
            </span>
            <button
              type="submit"
              disabled={loading || !newReview.trim()}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id || review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <img
                  src={review.userPhoto || "/default-avatar.png"}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-black">{review.userName}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-500">
                          {"★".repeat(review.rating)}
                        </span>
                        <span className="text-gray-300">
                          {"★".repeat(5 - review.rating)}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        </div>
      )}

      {/* Login Prompt Modal */}
      {loginPrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md p-8 relative"
          >
            <button
              onClick={() => setLoginPrompt(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please login to submit a review.
            </p>

            <button
              onClick={async () => {
                try {
                  await loginWithGoogle();
                  setLoginPrompt(false);
                } catch (error) {
                  console.error("Login failed:", error);
                }
              }}
              className="w-full bg-black text-white py-4 flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

/* ---------- MAIN COMPONENT ---------- */
export default function ProductDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const { cart, addToCart, updateQuantity } = useCart();
  const { loginWithGoogle, getLoggedInUser } = useGoogleAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/fetch/${slug}`, {
          headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status}`);
        }

        const data = await res.json();
        setProduct(data);
        setMainImage(data.img1 || "/placeholder.jpg");
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  useEffect(() => {
    // Load wishlist from localStorage
    const cachedWishlist = localStorage.getItem("wishlist");
    if (cachedWishlist) {
      try {
        const parsed = JSON.parse(cachedWishlist);
        setWishlist(parsed.map(id => String(id)));
      } catch (e) {
        console.error("Error parsing wishlist:", e);
      }
    }

    // Set quantity from cart
    const cartItem = cart[slug];
    setQuantity(cartItem?.quantity || 0);
  }, [cart, slug]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.productName,
          text: `Check out ${product?.productName}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const toggleWishlist = async () => {
    const user = getLoggedInUser();

    if (!user?.email) {
      try {
        await loginWithGoogle();
        const updatedUser = getLoggedInUser();
        if (!updatedUser?.email) return;
      } catch (error) {
        console.error("Login failed:", error);
        return;
      }
    }

    const idStr = String(slug);
    const isInWishlist = wishlist.includes(idStr);
    const updatedWishlist = isInWishlist
      ? wishlist.filter(id => id !== idStr)
      : [...wishlist, idStr];

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    try {
      const res = await fetch("/api/wishlist", {
        method: isInWishlist ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: getLoggedInUser().email,
          productId: slug,
        }),
      });

      if (!res.ok) {
        setWishlist(wishlist);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
      }
    } catch (error) {
      console.error("Wishlist update error:", error);
      setWishlist(wishlist);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  };

  const handleAddToCart = async () => {
    // Get logged in user
    const user = getLoggedInUser();
    if (!user?.email) {
      try {
        await loginWithGoogle();
        const updatedUser = getLoggedInUser();
        if (!updatedUser?.email) {
          setLoginPrompt(true);
          return;
        }
      } catch (error) {
        console.error("Login failed:", error);
        setLoginPrompt(true);
        return;
      }
    }

    if (!product) return;

    // Use the product's actual ID from the fetched data (slug or _id)
    const productId = product._id || slug;

    if (quantity === 0) {
      addToCart(productId, {
        id: productId,  // Ensure product ID is included here
        productName: product.productName,
        quantity: 1,
        price: calculateTotalPrice(product),
        image: product.img1,
        metal: product.metal,
        purity: product.purity,
        weight: product.netWeight,
        // Include all other necessary product data
        description: product.description,
        category: product.category,
        grossWeight: product.grossWeight,
        makingCharges: product.makingCharges,
        metalPrice: product.metalPrice,
        color: product.color,
        gender: product.gender,
        status: product.status
      });
      setQuantity(1);
    }
  };

  const handleBuyNow = async () => {
    // Get logged in user
    const user = getLoggedInUser();
    if (!user?.email) {
      try {
        await loginWithGoogle();
        const updatedUser = getLoggedInUser();
        if (!updatedUser?.email) {
          setLoginPrompt(true);
          return;
        }
      } catch (error) {
        console.error("Login failed:", error);
        setLoginPrompt(true);
        return;
      }
    }

    if (!product) return;

    // Use the product's actual ID from the fetched data (slug or _id)
    const productId = product._id || slug;

    if (quantity === 0) {
      addToCart(productId, {
        id: productId,  // Ensure product ID is included here
        productName: product.productName,
        quantity: 1,
        price: calculateTotalPrice(product),
        image: product.img1,
        metal: product.metal,
        purity: product.purity,
        weight: product.netWeight,
        // Include all other necessary product data
        description: product.description,
        category: product.category,
        grossWeight: product.grossWeight,
        makingCharges: product.makingCharges,
        metalPrice: product.metalPrice,
        color: product.color,
        gender: product.gender,
        status: product.status
      });
      setQuantity(1);
    }

    setTimeout(() => {
      setShowCheckoutPopup(true);
    }, 100);
  };

  const increaseQuantity = () => {
    if (!product) return;
    const productId = product._id || slug;
    const newQuantity = quantity + 1;
    updateQuantity(productId, newQuantity);
    setQuantity(newQuantity);
  };

  const decreaseQuantity = () => {
    if (!product) return;
    const productId = product._id || slug;
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      updateQuantity(productId, newQuantity);
      setQuantity(newQuantity);
    } else {
      updateQuantity(productId, 0);
      setQuantity(0);
    }
  };

  if (loading) {
    return (
      <div className="bg-back min-h-screen ci">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid lg:grid-cols-2 gap-12 pt-4">
          <div className="space-y-4">
            <div className="w-full h-[400px] md:h-[520px] bg-gray-200 animate-pulse rounded-lg" />
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-24 h-24 bg-gray-200 animate-pulse rounded" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="h-12 w-3/4 bg-gray-200 animate-pulse rounded" />
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
            <div className="h-32 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-14 w-full bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-back min-h-screen ci flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-black mb-4">Product Not Found</h2>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-black text-white hover:bg-gray-900 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Get all 3 images (filter out empty ones)
  const allImages = [product.img1, product.img2, product.img3].filter(Boolean);
  const isInWishlist = wishlist.includes(String(slug));
  const totalPrice = calculateTotalPrice(product);
  const productId = product._id || slug;

  return (
    <div className="bg-back min-h-screen ci px-2 sm:px-4">
      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-2 sm:top-6 sm:left-4 z-10 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black text-sm hover:bg-white transition-colors shadow-lg rounded-lg"
      >
        ← Back
      </button>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto py-8 md:py-12 grid lg:grid-cols-2 gap-6 md:gap-16 pt-4 md:pt-4">
        {/* IMAGES SECTION */}
        <div className="relative">
          {/* Desktop Layout: Main image left, thumbnails right in column */}
          <div className="hidden lg:grid grid-cols-[3fr_1fr] gap-6">
            {/* Main Image */}
            <div className="relative group">
              <img
                src={mainImage}
                alt={product.productName}
                className="w-full h-[520px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Thumbnails Column */}
            {allImages.length > 1 && (
              <div className="flex flex-col gap-4">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`h-[160px] overflow-hidden transition-all duration-300 ${mainImage === img
                      ? 'ring-2 ring-black ring-offset-2'
                      : 'opacity-80 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Layout: Main image above, thumbnails below in row */}
          <div className="lg:hidden space-y-4">
            {/* Main Image */}
            <div className="relative group">
              <img
                src={mainImage}
                alt={product.productName}
                className="w-full h-[350px] sm:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg"
              />
            </div>

            {/* Thumbnails Row - Only show if there's more than 1 image */}
            {allImages.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 px-1">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden transition-all duration-300 rounded-md ${mainImage === img
                      ? 'ring-2 ring-black ring-offset-1'
                      : 'opacity-80 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-col gap-2">
            <button
              onClick={toggleWishlist}
              className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            >
              {isInWishlist ? (
                <HeartSolid className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500" />
              ) : (
                <HeartOutline className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ShareIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
            </button>
          </div>

          {/* Share Success Message */}
          {shareSuccess && (
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-black text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm animate-fade-in">
              Link copied!
            </div>
          )}
        </div>

        {/* DETAILS SECTION */}
        <div className="space-y-6 md:space-y-8 px-2 sm:px-0">
          {/* Category Tag */}
          <span className="inline-block border border-black px-3 py-1.5 text-xs tracking-wide">
            {product.category?.toUpperCase() || "JEWELRY"}
          </span>

          {/* Product Name */}
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium text-black leading-tight">
            {product.productName}
          </h1>

          {/* Price */}
          <div className="space-y-1">
            <p className="text-xl sm:text-2xl md:text-3xl font-medium text-black">
              ₹{totalPrice.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              Includes making charges
            </p>
          </div>

          {/* Product Specs */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 py-4 sm:py-6 border-y border-gray-200">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Metal</p>
              <p className="font-medium capitalize text-sm sm:text-base">{product.metal}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Purity</p>
              <p className="font-medium text-sm sm:text-base">{product.purity}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Net Weight</p>
              <p className="font-medium text-sm sm:text-base">{product.netWeight}g</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Gross Weight</p>
              <p className="font-medium text-sm sm:text-base">{product.grossWeight}g</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Quantity Selector (only when item is in cart) - UPDATED FOR MOBILE */}
            {quantity > 0 ? (
              <div className="space-y-3">
                {/* Quantity Controls - Center aligned and compact */}
                <div className="flex items-center justify-center border border-black rounded-lg overflow-hidden max-w-xs mx-auto">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-2.5 sm:px-4 sm:py-3 hover:bg-gray-100 transition-colors flex-1 text-center"
                  >
                    −
                  </button>
                  <span className="px-4 py-2.5 sm:px-6 sm:py-3 border-x border-black flex-1 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-2.5 sm:px-4 sm:py-3 hover:bg-gray-100 transition-colors flex-1 text-center"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-black text-white py-3 text-base sm:text-lg hover:bg-gray-900 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-white border-2 border-black text-black py-3 text-base sm:text-lg hover:bg-black hover:text-white transition-all"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-black text-white py-3 text-base sm:text-lg hover:bg-gray-900 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 text-center">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Certified Quality</p>
                <p className="text-xs text-gray-600">BIS Hallmarked</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Easy Exchange</p>
                <p className="text-xs text-gray-600">7 Day Policy</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Authenticity</p>
                <p className="text-xs text-gray-600">Hallmark Certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED INFORMATION */}
      <div className="max-w-7xl mx-auto pb-4 md:pb-6 px-2 sm:px-4">
        <button
          onClick={() => setOpenInfo(!openInfo)}
          className="w-full flex justify-between items-center border-t border-b py-4 hover:bg-gray-50 transition-colors"
        >
          <span className="text-base sm:text-lg font-medium">Product Details</span>
          <span className="text-xl sm:text-2xl">{openInfo ? "−" : "+"}</span>
        </button>

        {openInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <div className="py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-3">Description</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Metal Type</p>
                  <p className="font-medium text-sm sm:text-base capitalize">{product.metal}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Purity</p>
                  <p className="font-medium text-sm sm:text-base">{product.purity}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Color</p>
                  <p className="font-medium text-sm sm:text-base capitalize">{product.color || "Classic"}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-sm sm:text-base capitalize">{product.gender}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Gross Weight</p>
                  <p className="font-medium text-sm sm:text-base">{product.grossWeight}g</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Net Weight</p>
                  <p className="font-medium text-sm sm:text-base">{product.netWeight}g</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Making Charges</p>
                  <p className="font-medium text-sm sm:text-base">₹{product.makingCharges?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Diamond Weight</p>
                  <p className="font-medium text-sm sm:text-base capitalize">{product.diamondWeight} CT</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* PRICE BREAKDOWN SECTION */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <PriceBreakdown product={product} />
      </div>

      {/* UPDATED REVIEWS SECTION */}
      <div className="max-w-7xl mx-auto pb-8 md:pb-12 px-2 sm:px-4 mt-8">
        <UpdatedReviewForm productId={productId} />
      </div>

      {/* LOGIN PROMPT */}
      {loginPrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md p-6 md:p-8 relative"
          >
            <button
              onClick={() => setLoginPrompt(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 className="text-xl md:text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please login to add items to your cart or proceed to checkout.
            </p>

            <button
              onClick={async () => {
                try {
                  await loginWithGoogle();
                  setLoginPrompt(false);
                } catch (error) {
                  console.error("Login failed:", error);
                }
              }}
              className="w-full bg-black text-white py-3 md:py-4 flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </motion.div>
        </div>
      )}

      {/* CHECKOUT POPUP */}
      {showCheckoutPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
          >
            <button
              onClick={() => setShowCheckoutPopup(false)}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-black"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6">Checkout</h2>
              <Checkout />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}