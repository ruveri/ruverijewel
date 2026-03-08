"use client"
import { useEffect, useState } from 'react';
import {
  FiPackage,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiChevronRight,
  FiMail
} from "react-icons/fi";

// Format date utility
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  return date.toLocaleDateString('en-GB', options).replace(',', '');
};

// Status helper
const getItemStatus = (status) => {
  switch (status) {
    case "Confirmed":
      return { text: "Confirmed", color: "bg-yellow-100 text-yellow-800", icon: <FiClock className="text-yellow-500" /> };
    case "Processing":
      return { text: "Luxury Packaging in Progress", color: "bg-purple-100 text-purple-800", icon: <FiPackage className="text-purple-500" /> };
    case "Shipped":
      return { text: "Shipped", color: "bg-blue-100 text-blue-800", icon: <FiTruck className="text-blue-500" /> };
    case "Delivered":
      return { text: "Delivered", color: "bg-green-100 text-green-800", icon: <FiCheckCircle className="text-green-500" /> };
    case "Cancelled":
      return { text: "Cancelled by Customer", color: "bg-red-100 text-red-800", icon: <FiCalendar className="text-red-500" /> };
    case "Rejected":
      return { text: "Rejected by Store", color: "bg-gray-100 text-gray-800", icon: <FiCalendar className="text-gray-500" /> };
    case "Replaced":
      return { text: "Order on Replacement", color: "bg-orange-100 text-orange-800", icon: <FiTruck className="text-orange-500" /> };
    default:
      return { text: "Processing", color: "bg-yellow-100 text-yellow-800", icon: <FiClock className="text-yellow-500" /> };
  }
};

// ── Order Card ──────────────────────────────────────────────────────────────
const OrderCard = ({ order, products }) => {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = getItemStatus(order.status);

  // Total from DB-stored amounts
  const totalAmount = order.items.reduce((sum, item) => sum + (item.amount || 0), 0);

  const getHelpEmailLink = (product, item) => {
    const email = "ruverijewel@gmail.com";
    const subject = `Help Request for Order #${order.orderId} - ${product.productName}`;
    const body =
      `Dear Support Team,\n\nI need assistance with my order:\n\n` +
      `Order ID: ${order.orderId}\n` +
      `Product ID: ${item.productId}\n` +
      `Product Name: ${product.productName}\n\n` +
      `Please describe your concern below:\n[Please include details about your issue and attach any relevant images]\n\n` +
      `Thank you,\n${order.userName}`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Check if this is a prepaid order (has razorpay fields)
  const isPrepaid = order.paymentMethod === "prepaid";

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`${statusInfo.color} px-3 py-1 rounded-full text-xs flex items-center gap-1`}>
              {statusInfo.icon}
              <span className="font-medium">{statusInfo.text}</span>
            </div>
            <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
              Order ID: {order.orderId}
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 text-sm flex items-center gap-1"
            >
              {expanded ? 'Less details' : 'More details'}
              <FiChevronRight className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-5">

            {/* ── Shipping Address ── */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <FiMapPin className="text-gray-500" />
                <h3 className="font-medium text-gray-900">Shipping Address</h3>
              </div>
              <div className="pl-6 text-sm">
                <div className="font-medium text-gray-900">{order.userName}</div>
                <div className="text-gray-600">{order.shippingAddress.full}</div>
                <div className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </div>
              </div>
            </div>

            {/* ── Payment & Delivery ── */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-700 mb-3">
                <FiCreditCard className="text-gray-500" />
                <h3 className="font-medium text-gray-900">Payment & Delivery</h3>
              </div>
              <div className="pl-6 text-sm space-y-2">
                <div>
                  <span className="text-gray-600">Payment Method: </span>
                  <span className="font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
                </div>

                {/* Razorpay fields — only shown for prepaid orders */}
                {isPrepaid && (
                  <>
                    {order.razorpayOrderId && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="text-gray-600 shrink-0">Razorpay Order ID: </span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700 break-all">
                          {order.razorpayOrderId}
                        </span>
                      </div>
                    )}
                    {order.razorpayPaymentId && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="text-gray-600 shrink-0">Razorpay Payment ID: </span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700 break-all">
                          {order.razorpayPaymentId}
                        </span>
                      </div>
                    )}
                    {order.razorpaySignature && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="text-gray-600 shrink-0">Razorpay Signature: </span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700 break-all">
                          {order.razorpaySignature}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ── Product Details ── */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <FiPackage className="text-gray-500" />
                <h3 className="font-medium text-gray-900">Product Details</h3>
              </div>

              <div className="pl-2">
                {order.items.map((item) => {
                  const product = products[item.productId];

                  // Price as stored in the order DB (authoritative)
                  const itemPrice = item.amount ?? 0;

                  // Size — "Not Applicable" covers non-ring/bangle categories
                  const sizeLabel = item.size && item.size.trim() !== "" && item.size !== "Not Applicable"
                    ? item.size
                    : null;

                  return (
                    <div key={item._id} className="border-t border-gray-200 py-4">
                      <div className="flex gap-4">
                        {product ? (
                          <img
                            src={product.img1}
                            alt={product.productName}
                            className="w-20 h-20 object-contain border rounded-lg bg-white"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FiPackage className="text-gray-400" />
                          </div>
                        )}

                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {product ? product.productName : "Product Not Found"}
                          </h4>

                          <div className="grid gap-2 mt-2 text-sm">
                            {/* Price from order DB */}
                            <div>
                              <span className="text-gray-600">Price: </span>
                              <span className="font-medium text-gray-900">₹{itemPrice.toLocaleString()}</span>
                            </div>

                            {/* Quantity */}
                            <div>
                              <span className="text-gray-600">Quantity: </span>
                              <span className="font-medium text-gray-900">{item.quantity}</span>
                            </div>

                            {/* Size — shown only if applicable */}
                            <div>
                              <span className="text-gray-600">Size: </span>
                              {sizeLabel ? (
                                <span className="font-medium text-gray-900">{sizeLabel}</span>
                              ) : (
                                <span className="text-gray-400 text-xs">Not Applicable</span>
                              )}
                            </div>

                            {/* Product ID */}
                            <div>
                              <span className="text-gray-600">Product ID: </span>
                              <span className="font-mono text-xs text-gray-600">{item.productId}</span>
                            </div>

                            {/* Help button */}
                            {product && (
                              <div className="mt-2">
                                <a
                                  href={getHelpEmailLink(product, item)}
                                  className="inline-flex items-center gap-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 px-3 rounded-lg transition-colors"
                                >
                                  <FiMail className="w-4 h-4" />
                                  <span>Click for Help</span>
                                </a>
                                <p className="text-xs text-gray-500 mt-1">
                                  For returns, exchanges, or any product concerns
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Order total */}
                <div className="border-t border-gray-200 pt-4 mt-2 flex justify-end">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Order Total:</div>
                    <div className="text-lg font-bold text-gray-900">₹{totalAmount.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Orders Page ────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [products, setProducts] = useState({});

  useEffect(() => {
    async function fetchOrders() {
      try {
        const stored = localStorage.getItem("google_user");
        if (!stored) { setLoading(false); return; }

        const { email, uid } = JSON.parse(stored);
        if (!email || !uid) { setLoading(false); return; }

        // Verify user
        const verifyRes = await fetch(`/api/verifyuser?email=${encodeURIComponent(email)}&uid=${uid}`);
        if (!verifyRes.ok) throw new Error("User verification failed");

        // Fetch orders
        const ordersRes = await fetch(`/api/getmyorders?email=${encodeURIComponent(email)}`);
        const ordersData = (await ordersRes.json()).orders || [];

        // Flatten all items with top-level order info attached
        let allItems = [];
        ordersData.forEach(order => {
          order.items.forEach(item => {
            allItems.push({ ...item, userName: order.name });
          });
        });

        // Group by orderId
        const ordersGrouped = {};
        allItems.forEach(item => {
          if (!ordersGrouped[item.orderId]) ordersGrouped[item.orderId] = [];
          ordersGrouped[item.orderId].push(item);
        });

        // Build sorted orders array
        // Pull razorpay fields from the first item (they're identical across items in the same order)
        const ordersArray = Object.keys(ordersGrouped).map(orderId => {
          const items = ordersGrouped[orderId];
          const firstItem = items[0];
          return {
            orderId,
            status: firstItem.orderStatus,
            userName: firstItem.userName,
            shippingAddress: {
              full: firstItem.fullAddress,
              city: firstItem.city,
              state: firstItem.state,
              pincode: firstItem.pincode,
            },
            paymentMethod: firstItem.method,
            // ── Razorpay fields pulled from the stored order item ──
            razorpayOrderId: firstItem.razorpayOrderId || null,
            razorpayPaymentId: firstItem.razorpayPaymentId || null,
            razorpaySignature: firstItem.razorpaySignature || null,
            createdAt: firstItem.createdAt,
            items,
          };
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setGroupedOrders(ordersArray);

        // Fetch product details for all unique product IDs
        const allProductIds = Array.from(new Set(allItems.map(item => item.productId)));
        const fetchedProducts = {};
        await Promise.all(
          allProductIds.map(async (id) => {
            try {
              const res = await fetch(`/api/products/fetch/${id}`, {
                headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
              });
              fetchedProducts[id] = await res.json();
            } catch (err) {
              console.log(`Failed to fetch product ${id}`, err);
              fetchedProducts[id] = null;
            }
          })
        );
        setProducts(fetchedProducts);

      } catch (err) {
        console.log("Error verifying user or fetching orders:", err);
        localStorage.removeItem("google_user");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-back py-6 sm:py-8 ci">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">View your order history and track shipments</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : groupedOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md mx-auto shadow-sm">
            <div className="text-gray-400 mb-4">
              <FiPackage className="mx-auto text-4xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} products={products} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}