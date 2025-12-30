"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import UserPopup from "../components/userpopup";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
  </div>
);

export default function Products({ category, title }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const filterRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Purity filter states
  const [selectedPurities, setSelectedPurities] = useState([]);

  // wishlist is now an array of productId strings
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Purity options for buttons
  const purityOptions = ["22K", "20K", "925 Silver", "900 Silver"];

  // Toggle purity selection
  const togglePurity = (purity) => {
    setSelectedPurities(prev => {
      if (prev.includes(purity)) {
        return prev.filter(p => p !== purity);
      } else {
        return [...prev, purity];
      }
    });
  };

  // Filter products based on selected purities
  useEffect(() => {
    if (!products.length) return;

    if (selectedPurities.length === 0) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      selectedPurities.includes(product.purity)
    );
    setFilteredProducts(filtered);
  }, [products, selectedPurities]);

  // checkLogin loads user + tries local cached wishlist for instant UI
  useEffect(() => {
    const checkLogin = () => {
      const stored = localStorage.getItem("user");
      const storedWishlist = localStorage.getItem("wishlist");

      if (stored) {
        const parsed = JSON.parse(stored);
        setIsLoggedIn(!!parsed.phone);
        setUser(parsed);

        if (parsed.phone) {
          if (storedWishlist) {
            try {
              const parsedWishlist = JSON.parse(storedWishlist).map(id => String(id));
              setWishlist(parsedWishlist);
            } catch (e) { }
            setWishlistLoading(false);
            fetchWishlist(parsed.phone, { silent: true });
          } else {
            fetchWishlist(parsed.phone);
          }
        } else {
          setWishlist([]);
          setWishlistLoading(false);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setWishlist([]);
        setWishlistLoading(false);
      }
    };

    checkLogin();
    window.addEventListener("storage", checkLogin); // cross-tab
    const interval = setInterval(checkLogin, 1000); // same-tab changes

    return () => {
      window.removeEventListener("storage", checkLogin);
      clearInterval(interval);
    };
  }, []);

  // fetchWishlist: returns list of productId strings from server
  const fetchWishlist = async (phone, { silent = false } = {}) => {
    try {
      if (!silent) setWishlistLoading(true);
      const res = await fetch(`/api/wishlist?userPhone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      // server returns full wishlist objects: map to productId strings
      const ids = Array.isArray(data.wishlist)
        ? data.wishlist.map(w => String(w.productId))
        : [];
      setWishlist(ids);
      try {
        localStorage.setItem("wishlist", JSON.stringify(ids));
      } catch (e) {
        // ignore localStorage quota errors
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  // toggle wishlist with optimistic UI update
  const toggleWishlist = async (productId) => {
    // Always re-check login at click time
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setIsLoggedIn(!!parsed.phone);
      setUser(parsed);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    const idStr = String(productId);
    const currentlyIn = wishlist.includes(idStr);
    const prevWishlist = wishlist.slice();

    const nextWishlist = currentlyIn
      ? prevWishlist.filter(id => id !== idStr)
      : [...prevWishlist, idStr];

    setWishlist(nextWishlist);
    try { localStorage.setItem("wishlist", JSON.stringify(nextWishlist)); } catch (e) { }

    try {
      const res = await fetch("/api/wishlist", {
        method: currentlyIn ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPhone: user.phone, productId: idStr })
      });

      if (!res.ok) {
        setWishlist(prevWishlist);
        try { localStorage.setItem("wishlist", JSON.stringify(prevWishlist)); } catch (e) { }
      } else {
        fetchWishlist(user.phone, { silent: true });
      }
    } catch (err) {
      setWishlist(prevWishlist);
      try { localStorage.setItem("wishlist", JSON.stringify(prevWishlist)); } catch (e) { }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedProducts = useMemo(() => {
    if (!selectedFilter) return filteredProducts;

    return [...filteredProducts].sort((a, b) => {
      switch (selectedFilter) {
        case "price_low_high":
          return a.originalPrice - b.originalPrice;
        case "price_high_low":
          return b.originalPrice - a.originalPrice;
        case "alphabetical":
          return a.productName.localeCompare(b.productName);
        default:
          return 0;
      }
    });
  }, [filteredProducts, selectedFilter]);

  // Reset state when category changes
  useEffect(() => {
    setProducts([]);
    setFilteredProducts([]);
    setSelectedPurities([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
  }, [category]);

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [page, category]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `/api/products?page=${page}&limit=${limit}&category=${encodeURIComponent(category)}`,
        { headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } }
      );
      const data = await res.json();

      if (data.length < limit) setHasMore(false);

      setProducts(prev => {
        const seen = new Set(prev.map(p => p._id));
        const unique = data.filter(p => !seen.has(p._id));
        const newProducts = [...prev, ...unique];
        return newProducts;
      });

      setFilteredProducts(prev => {
        const seen = new Set(prev.map(p => p._id));
        const unique = data.filter(p => !seen.has(p._id));
        return [...prev, ...unique];
      });

    } catch (e) {
      console.log("Error loading products:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  // Display products - either sorted or filtered
  const displayProducts = sortedProducts;

  return (
    <div className="bg-back ci my-6">
      <div className="container mx-auto px-6">
        {showLoginPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <UserPopup
              onClose={() => setShowLoginPopup(false)}
              onSuccess={(userData) => {
                setIsLoggedIn(true);
                setUser(userData);
                setShowLoginPopup(false);
                // after login, fetch wishlist for this user
                if (userData?.phone) fetchWishlist(userData.phone);
              }}
            />
          </div>
        )}

        {/* Header Section - Always visible */}
        <div className="mb-8">
          {/* First line: Heading and Price Filter (for mobile) */}
          {title && (
            <motion.h1
              className="hidden  md:flex text-2xl md:text-4xl font-bold justify-left items-center text-black tracking-wide "
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {title}
            </motion.h1>
          )}
          <div className="flex flex-row justify-between items-center mb-4">
            {/* Title - Always show if title exists */}
            {title && (
              <motion.h1
                className="md:hidden text-2xl md:text-4xl font-bold justify-center items-center text-black tracking-wide "
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {title}
              </motion.h1>
            )}

            {!loading && (
              <div className="hidden md:flex mt-4 md:mt-0">
                <div className="flex flex-wrap overflow-x-auto gap-2">
                  {purityOptions.map(purity => (
                    <button
                      key={purity}
                      onClick={() => togglePurity(purity)}
                      className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${selectedPurities.includes(purity)
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-black'
                        }`}
                    >
                      {purity}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Original Filter Button - Always visible when not loading */}
            {!loading && (
              <div className="flex justify-end md:justify-normal">
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm w-full md:w-auto"
                  >
                    <span>Filter</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() => { setSelectedFilter("price_low_high"); setIsFilterOpen(false); }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center ${selectedFilter === "price_low_high" ? "bg-gray-50 font-medium" : ""}`}
                      >
                        Price: Low to High
                      </button>
                      <button
                        onClick={() => { setSelectedFilter("price_high_low"); setIsFilterOpen(false); }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center ${selectedFilter === "price_high_low" ? "bg-gray-50 font-medium" : ""}`}
                      >
                        Price: High to Low
                      </button>
                      <button
                        onClick={() => { setSelectedFilter("alphabetical"); setIsFilterOpen(false); }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center ${selectedFilter === "alphabetical" ? "bg-gray-50 font-medium" : ""}`}
                      >
                        Alphabetical Order
                      </button>
                      {selectedFilter && (
                        <button
                          onClick={() => { setSelectedFilter(null); setIsFilterOpen(false); }}
                          className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors border-t border-gray-200 flex items-center"
                        >
                          Clear Filter
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
          {!loading && (
              <div className="md:hidden mt-4 md:mt-0">
                <div className="flex flex-wrap overflow-x-auto gap-2">
                  {purityOptions.map(purity => (
                    <button
                      key={purity}
                      onClick={() => togglePurity(purity)}
                      className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${selectedPurities.includes(purity)
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-black'
                        }`}
                    >
                      {purity}
                    </button>
                  ))}
                </div>
              </div>
            )}


        </div>

        {/* No Products Available Message */}
        {!loading && displayProducts.length === 0 && (
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto"
            >
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Products Available</h3>
              <p className="text-gray-500 mb-6">
                {selectedPurities.length > 0
                  ? `No products found with ${selectedPurities.join(", ")} purity`
                  : "No products found in this category"}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </Link>
            </motion.div>
          </div>
        )}

        {/* Products Grid */}
        {displayProducts.length > 0 && (
          <motion.div
            className="grid gap-6 grid-cols-2 md:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {displayProducts.map((product) => {

              if (wishlistLoading) {
                return (
                  <div key={product._id} className="overflow-hidden">
                    <div className="relative w-full md:h-72 h-52 overflow-hidden"><Skeleton className="w-full h-full" /></div>
                    <div className="py-4 px-1 text-start">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <div className="flex justify-start items-center space-x-2 mt-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </div>
                );
              }

              // compare strings — ensure both sides are strings
              const isInWishlist = wishlist.includes(String(product._id));

              return (
                <motion.div
                  key={product._id}
                  className="overflow-hidden hover:shadow-2xl transition-shadow duration-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product._id); }}
                    className="absolute top-2 right-2 z-10 p-2 bg-back rounded-full backdrop-blur-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 transition-colors ${isInWishlist ? "text-red-500 fill-current" : "text-black stroke-current fill-none"}`}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>

                  <Link href={`/products/${product._id}`}>
                    <div>
                      <div className="relative w-full md:h-72 h-52 overflow-hidden">
                        <motion.img src={product.img1} alt={product.productName} className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500" initial={{ opacity: 1 }} whileHover={{ opacity: 0 }} />
                        <motion.img src={product.img2} alt={`${product.productName} Hover`} className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} />
                      </div>

                      <div className="py-4 px-1 text-start">
                        <h2 className="text-sm lg:text-lg font-semibold text-black">{product.productName}</h2>
                        <div className="flex justify-start items-center">
                          <p className="text-md lg:text-xl text-black font-semibold">
                            ₹{product.totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {loading && [...Array(4)].map((_, i) => (
              <div key={i} className="overflow-hidden">
                <div className="relative w-full md:h-72 h-52 overflow-hidden"><Skeleton className="w-full h-full" /></div>
                <div className="py-4 px-1 text-start">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="flex justify-start items-center space-x-2 mt-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {hasMore && !loading && displayProducts.length > 0 && (
          <div className="text-center mt-8">
            <button onClick={loadMore} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-black/90 transition-all">Load More</button>
          </div>
        )}
      </div>
    </div>
  );
}