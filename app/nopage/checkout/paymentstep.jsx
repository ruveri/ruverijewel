"use client";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { loadRazorpay } from "../../lib/razorpay";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentStep({ userData }) {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCharge = userData?.shippingCharge || 0;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const discount = totalQuantity * 100;
  const total = subtotal;
  const online = total - discount;
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isCouponEligible, setIsCouponEligible] = useState(true);
  const [loadingText, setLoadingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate prices with coupon discount
  const discountFromCoupon = appliedCoupon ? appliedCoupon.discount : 0;
  const totalAfterCoupon = total - discountFromCoupon;
  const onlineAfterCoupon = online - discountFromCoupon;

  useEffect(() => {
    const checkCouponEligibility = async () => {
      try {
        const res = await fetch("/api/coupon/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userPhone: userData.phone,
          }),
        });
        
        const data = await res.json();
        setIsCouponEligible(data.eligible);
      } catch (error) {
        console.error("Coupon eligibility check failed:", error);
      }
    };
    
    if (userData?.phone) {
      checkCouponEligibility();
    }
  }, [userData]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          couponCode: couponCode.trim(),
          userPhone: userData.phone 
        }),
      });

      const data = await res.json();
      
      if (data.valid) {
        setAppliedCoupon({
          code: data.couponCode,
          discount: data.discount
        });
        setCouponError("");
      } else {
        setCouponError(data.message || "Invalid coupon");
      }
    } catch (error) {
      setCouponError("Failed to apply coupon");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const validateOrder = () => {
    if (shippingCharge < 0) throw new Error("Invalid shipping charge. Please refresh.");
    if (totalAfterCoupon <= 0) throw new Error("Order total cannot be zero.");
  };

  const handlePayment = async (paymentMethod) => {
    try {
      setLoadingText(paymentMethod === "cod" ? "Placing order..." : "Processing payment...");
      setLoading(true);
      setError("");
      validateOrder();

      // Create order payload with coupon details
      const orderPayload = {
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          name: item.name || "",
        })),
        address: userData.address,
        shippingCharge,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
        discountAmount: discountFromCoupon
      };

      const orderRes = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) throw new Error("Failed to create order.");
      const orderData = await orderRes.json();

      if (paymentMethod === "cod") {
        // Store the order with coupon details
        await fetch("/api/placeorder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY
          },
          body: JSON.stringify({
            number: userData.phone,
            name: userData.name,
            email: userData.email,
            address: userData.address,
            items: cartItems,
            method: "COD",
            total: totalAfterCoupon,
            couponCode: appliedCoupon?.code || null,
            discountAmount: discountFromCoupon
          }),
        });

        router.push("/thank-you");
        clearCart();
        return;
      }

      // Razorpay payment flow
      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: onlineAfterCoupon * 100, // Convert to paise
        currency: "INR",
        name: "Erroneous Gold",
        description: "Order Payment",
        image: "/logo.png",
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          const orderData = {
            number: userData.phone,
            name: userData.name,
            email: userData.email,
            address: userData.address,
            items: cartItems,
            method: "prepaid",
            total: onlineAfterCoupon,
            couponCode: appliedCoupon?.code || null,
            discountAmount: discountFromCoupon
          };

          const verifyRes = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, orderData }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            await fetch("/api/placeorder", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY
              },
              body: JSON.stringify(orderData),
            });

            clearCart();
            router.push("/thank-you");
          } else {
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: userData.name,
          contact: userData.phone,
        },
        theme: { color: "#1b4638" },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (error) {
      console.log("Payment Error:", error);
      setError(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRazorpay();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 text-sm">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded shadow text-center text-base font-medium text-gray-800 animate-pulse">
            {loadingText}
          </div>
        </div>
      )}

      


      {/* Order Summary */}
      <div className="bg-white rounded shadow space-y-3 p-1">
        <h2 className="text-base font-semibold border-b pb-2">Order Summary</h2>
        <div className="space-y-2 max-h-56 overflow-auto pr-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3 pb-2">
              {/* Product Image */}
              <div className="w-20 h-20 shrink-0 overflow-hidden rounded border bg-white">
                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between text-sm w-full">
                <p className="font-medium text-gray-900">{item.productName}</p>
                {item.name && (
                  <p className="text-xs text-gray-500">Engraved Name: {item.name}</p>
                )}
                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                <div className="flex items-center gap-2">
                  {item.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                  )}
                  <span className="font-semibold text-gray-800">₹{item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 space-y-1 text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between">
              <span>Coupon Discount ({appliedCoupon.code})</span>
              <span className="text-green-600">-₹{appliedCoupon.discount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="flex items-center gap-2">
              <span className="text-green-600 ">Free</span>
              {/* <span className="line-through text-gray-400">₹{shippingCharge || 99}</span> */}
            </span>

          </div>
          <div className="flex justify-between font-semibold text-base text-gray-900 pt-2 border-t">
            <span>Total</span>
            <span>₹{totalAfterCoupon}</span>
          </div>
        </div>
      </div>
      {isCouponEligible && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-base font-semibold mb-3">Apply Coupon</h2>
          
          {appliedCoupon ? (
            <div className="flex justify-between items-center bg-green-50 p-3 rounded border border-green-200">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span>
                  Coupon applied: {appliedCoupon.code} (-₹{appliedCoupon.discount})
                </span>
              </div>
              <button 
                onClick={handleRemoveCoupon}
                className="text-gray-500 hover:text-red-500"
              >
                ✕ Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="flex-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-c4"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={!isCouponEligible}
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-c4 text-white px-4 rounded hover:bg-c4/90 transition-colors disabled:opacity-50"
                disabled={!couponCode.trim() || !isCouponEligible}
              >
                Apply
              </button>
            </div>
          )}
          
          {couponError && (
            <div className="text-red-500 text-sm mt-2">{couponError}</div>
          )}
          
          {!appliedCoupon && isCouponEligible && (
            <div className="text-xs text-gray-500 mt-2">
              Use <span className="font-bold">WELCOME50</span> for ₹50 off your first order
            </div>
          )}
          
          {!isCouponEligible && (
            <div className="text-gray-500 text-sm mt-2">
              You&apos;ve already used your welcome coupon
            </div>
          )}
        </div>
      )}

      {/* Payment Options */}
      <div className="bg-white rounded shadow p-1 space-y-4">
        <h2 className="text-base font-semibold border-b pb-2">Payment Options</h2>
        <p className="text-xs font-medium text-gray-600">
          Extra Discounts + Free Gifts on Prepaid Orders
        </p>

        {[
          { label: "Pay via UPI", desc: "GPay, PhonePe, Paytm" },
          { label: "Debit/Credit Cards", desc: "Visa, MasterCard, Rupay" },
          { label: "Wallets", desc: "PhonePe, Amazon, Mobikwik" },
          { label: "Netbanking", desc: "SBI, HDFC, ICICI, Axis" },
        ].map((method, index) => (
          <button
            key={index}
            onClick={() => handlePayment("prepaid")}
            className="relative w-full flex justify-between items-center bg-c1 text-black py-3 px-2 rounded transition text-sm"
          >
            <div className="absolute -top-2 left-2 bg-c4 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Free Gift + ₹{100 * totalQuantity} off
            </div>
            <div className="text-left mt-1">
              <p className="font-bold">{method.label}</p>
              <p className="text-xs">{method.desc}</p>
            </div>
            <div className="text-left mt-1">
              <div className="text-right  line-through opacity-60 text-xs ml-1">₹{total}</div>
              <div className="text-right text-base">₹{onlineAfterCoupon}</div>

            </div>
          </button>
        ))}

        {/* COD */}
        <button
          onClick={() => handlePayment("cod")}
          className="w-full flex justify-between items-center bg-black text-white py-3 px-3 rounded text-sm"
        >
          <div className="text-left">
            <p className="font-bold">Cash on Delivery</p>
            <p className="text-xs text-gray-300">We Recommend Prepaid for Fast Shipping</p>
          </div>
          <div className="text-right  text-base">₹{totalAfterCoupon}</div>
        </button>

        <div className="text-xs text-gray-600 pt-4 border-t mt-4 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-green-600">🔒</span>
            <p className="font-medium">100% Secure & Encrypted Payments</p>
          </div>
          <p className="text-gray-500">
            Need help?{" "}
            <Link href="/contact-us" className="text-c4 font-medium underline hover:text-c4/80">
              Contact our support team
            </Link>
          </p>
        </div>

      </div>
    </div >
  );
}