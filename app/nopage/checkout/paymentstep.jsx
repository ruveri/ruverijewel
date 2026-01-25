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
  
  const [loadingText, setLoadingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for real-time prices
  const [productPrices, setProductPrices] = useState({});
  const [pricesLoading, setPricesLoading] = useState(true);
  const [priceError, setPriceError] = useState(null);

  // Fetch real-time prices for all cart items
  useEffect(() => {
    const fetchProductPrices = async () => {
      setPricesLoading(true);
      setPriceError(null);
      
      try {
        const pricePromises = cartItems.map(async (item) => {
          const res = await fetch(`/api/products/fetch/${item.id}`, {
            headers: {
              "x-api-key": process.env.NEXT_PUBLIC_API_KEY
            }
          });
          
          if (!res.ok) {
            throw new Error(`Failed to fetch price for ${item.productName}`);
          }
          
          const data = await res.json();
          return {
            id: item.id,
            totalPrice: data.totalPrice,
            productData: data
          };
        });

        const prices = await Promise.all(pricePromises);
        
        const priceMap = {};
        prices.forEach(({ id, totalPrice, productData }) => {
          priceMap[id] = { totalPrice, productData };
        });
        
        setProductPrices(priceMap);
      } catch (err) {
        console.error("Error fetching product prices:", err);
        setPriceError(err.message);
      } finally {
        setPricesLoading(false);
      }
    };

    if (cartItems.length > 0) {
      fetchProductPrices();
    }
  }, [cartItems.length]);

  // Calculate prices using real-time data
  const subtotal = cartItems.reduce((sum, item) => {
    const currentPrice = productPrices[item.id]?.totalPrice || item.price;
    return sum + currentPrice * item.quantity;
  }, 0);
  
  const shippingCharge = userData?.shippingCharge || 0;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const discount = totalQuantity * 100; // ₹100 discount per item for prepaid
  const total = subtotal; // COD price
  const online = total; // Prepaid price with discount
  const donline = total - discount;

  const validateOrder = () => {
    if (shippingCharge < 0) throw new Error("Invalid shipping charge. Please refresh.");
    if (total <= 0) throw new Error("Order total cannot be zero.");
    if (pricesLoading) throw new Error("Please wait while we load current prices.");
    if (priceError) throw new Error("Failed to load current prices. Please refresh.");
  };

  const handlePayment = async (paymentMethod) => {
    try {
      setLoadingText(paymentMethod === "cod" ? "Placing order..." : "Processing payment...");
      setLoading(true);
      setError("");
      validateOrder();

      // Create cart items with real-time prices
      const itemsWithCurrentPrices = cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: productPrices[item.id]?.totalPrice || item.price,
        productName: item.productName,
        image: item.image
      }));

      // Determine final total based on payment method
      const finalTotal = paymentMethod === "cod" ? total : online;

      // Create order payload for Razorpay - API only needs id and quantity
      const orderPayload = {
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        address: userData.address,
        shippingCharge,
        paymentMethod,
        discountAmount: paymentMethod === "prepaid" ? discount : 0
      };

      const orderRes = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.message || "Failed to create order.");
      }
      
      const orderData = await orderRes.json();

      if (paymentMethod === "cod") {
        // Store the COD order directly
        await fetch("/api/placeorder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY
          },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            address: userData.address,
            items: itemsWithCurrentPrices,
            method: "COD",
            total: finalTotal
          }),
        });

        clearCart();
        router.push("/thank-you");
        return;
      }

      // Razorpay payment flow for prepaid orders
      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: online * 100, // Convert to paise
        currency: "INR",
        name: "Erroneous Gold",
        description: "Order Payment",
        image: "/logo.png",
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          try {
            // Verify payment signature first
            const verifyRes = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // Payment verified successfully, now place the order
              await fetch("/api/placeorder", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": process.env.NEXT_PUBLIC_API_KEY
                },
                body: JSON.stringify({
                  name: userData.name,
                  email: userData.email,
                  address: userData.address,
                  items: itemsWithCurrentPrices,
                  method: "prepaid",
                  total: online,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                }),
              });

              clearCart();
              router.push("/thank-you");
            } else {
              setError("Payment verification failed. Please contact support.");
              setLoading(false);
            }
          } catch (err) {
            console.error("Payment handler error:", err);
            setError("Payment processing failed. Please contact support.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setError("Payment cancelled. Please try again.");
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
        },
        theme: { color: "#1b4638" },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (error) {
      console.log("Payment Error:", error);
      setError(error.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRazorpay();
  }, []);

  // Show loading state while fetching prices
  if (pricesLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 text-sm">
        <div className="bg-white rounded shadow p-6 text-center">
          <div className="animate-pulse">
            <div className="text-lg font-semibold text-gray-700">Loading current prices...</div>
            <div className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest pricing</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if price fetching failed
  if (priceError) {
    return (
      <div className="grid grid-cols-1 gap-4 text-sm">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="font-semibold">Failed to load current prices</div>
          <div className="text-sm mt-1">{priceError}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

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
      <div className="bg-white rounded shadow space-y-3 p-4">
        <h2 className="text-base font-semibold border-b pb-2">Order Summary</h2>
        <div className="space-y-2 max-h-56 overflow-auto pr-2">
          {cartItems.map((item) => {
            const currentPrice = productPrices[item.id]?.totalPrice || item.price;
            const priceChanged = currentPrice !== item.price;
            
            return (
              <div key={item.id} className="flex items-start gap-3 pb-2 border-b last:border-b-0">
                {/* Product Image */}
                <div className="w-20 h-20 shrink-0 overflow-hidden rounded border bg-white">
                  <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-between text-sm w-full">
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${priceChanged ? 'text-black' : 'text-gray-800'}`}>
                      ₹{currentPrice}
                    </span>
                    {priceChanged && (
                      <span className="text-xs text-green-600">(Updated)</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t pt-3 space-y-1 text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between font-semibold text-base text-gray-900 pt-2 border-t">
            <span>Total (COD)</span>
            <span>₹{total}</span>
          </div>
          <div className="flex justify-between font-semibold text-base text-green-600">
            <span>Total (Prepaid)</span>
            <span>₹{donline} <span className="text-xs font-normal">(Save ₹{discount})</span></span>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-white rounded shadow p-4 space-y-4">
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
            disabled={loading}
            className="relative w-full flex justify-between items-center bg-c1 text-black py-3 px-2 rounded transition text-sm hover:bg-c1/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute -top-2 left-2 bg-c4 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
               ₹{100 * totalQuantity} off
            </div>
            <div className="text-left mt-1">
              <p className="font-bold">{method.label}</p>
              <p className="text-xs">{method.desc}</p>
            </div>
            <div className="text-left mt-1">
              <div className="text-right line-through opacity-60 text-xs ml-1">₹{total}</div>
              <div className="text-right text-base">₹{donline}</div>
            </div>
          </button>
        ))}

        {/* COD */}
        <button
          onClick={() => handlePayment("cod")}
          disabled={loading}
          className="w-full flex justify-between items-center bg-black text-white py-3 px-3 rounded text-sm hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-left">
            <p className="font-bold">Cash on Delivery</p>
            <p className="text-xs text-gray-300">We Recommend Prepaid for Fast Shipping</p>
          </div>
          <div className="text-right text-base">₹{total}</div>
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
    </div>
  );
}