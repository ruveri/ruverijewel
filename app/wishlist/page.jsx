"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGoogleAuth } from "../nopage/components/useGoogleAuth";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
  </div>
);

export default function WishlistPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { loginWithGoogle, user, isLoggedIn, getLoggedInUser, loading: authLoading } = useGoogleAuth();
    
    // New state for optimistic UI updates
    const [wishlistProductIds, setWishlistProductIds] = useState([]);

    // Debug logging
    useEffect(() => {
        console.log("Auth State:", { 
            user, 
            isLoggedIn, 
            authLoading,
            fromHook: getLoggedInUser(),
            localStorage: localStorage.getItem("google_user") 
        });
    }, [user, isLoggedIn, authLoading]);

    // Check authentication and load wishlist on mount
    useEffect(() => {
        if (authLoading) return; // Wait for auth to initialize

        const initWishlist = async () => {
            console.log("Initializing wishlist...");
            const currentUser = getLoggedInUser();
            
            console.log("Current user from hook:", currentUser);
            
            if (currentUser && currentUser.email) {
                console.log("User found, email:", currentUser.email);
                
                // Load cached wishlist first for instant UI
                const cachedWishlist = localStorage.getItem("wishlist");
                if (cachedWishlist) {
                    try {
                        const parsed = JSON.parse(cachedWishlist);
                        setWishlistProductIds(parsed.map(id => String(id)));
                        console.log("Cached wishlist IDs:", parsed);
                    } catch (e) {
                        console.error("Error parsing cached wishlist:", e);
                    }
                }
                
                // Then fetch from server and get full product details
                await fetchWishlistProducts(currentUser.email);
            } else {
                console.log("No user found in initWishlist");
                setProducts([]);
                setWishlistProductIds([]);
                setLoading(false);
                localStorage.removeItem("wishlist");
            }
        };

        initWishlist();

        // Listen for auth changes across tabs
        const onStorage = (e) => {
            if (e.key === "google_user") {
                console.log("google_user changed in storage, reloading...");
                initWishlist();
            }
        };

        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [authLoading, getLoggedInUser]);

    // Fetch wishlist IDs from server
    const fetchWishlistIds = async (userEmail) => {
        try {
            console.log("Fetching wishlist for email:", userEmail);
            
            const res = await fetch(
                `/api/wishlist?userEmail=${encodeURIComponent(userEmail)}`
            );

            if (!res.ok) {
                console.error("API response not OK:", res.status, res.statusText);
                throw new Error(`Failed to fetch wishlist: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            console.log("Wishlist API response:", data);
            
            const ids = Array.isArray(data.wishlist)
                ? data.wishlist.map(item => String(item.productId))
                : [];

            console.log("Parsed wishlist IDs:", ids);
            setWishlistProductIds(ids);
            localStorage.setItem("wishlist", JSON.stringify(ids));
            return ids;
        } catch (error) {
            console.error("Wishlist fetch error:", error);
            return [];
        }
    };

    // Fetch full product details for wishlist items
    const fetchWishlistProducts = async (userEmail) => {
        try {
            setLoading(true);
            console.log("Starting to fetch wishlist products...");

            // First get the wishlist IDs
            const wishlistIds = await fetchWishlistIds(userEmail);
            console.log("Wishlist IDs from server:", wishlistIds);
            
            if (wishlistIds.length === 0) {
                console.log("No wishlist items found");
                setProducts([]);
                setLoading(false);
                return;
            }

            console.log(`Fetching ${wishlistIds.length} products...`);
            
            // Fetch product details for each ID
            const productPromises = wishlistIds.map(async (productId) => {
                try {
                    console.log(`Fetching product ${productId}...`);
                    const res = await fetch(`/api/products/fetch/${productId}`, {
                        headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                    });
                    
                    if (!res.ok) {
                        console.error(`Product ${productId} fetch failed:`, res.status, res.statusText);
                        return null;
                    }
                    
                    const product = await res.json();
                    console.log(`Product ${productId} fetched:`, product?.productName);
                    
                    // Only include live products
                    return product?.status === "live" ? product : null;
                } catch (error) {
                    console.error(`Error fetching product ${productId}:`, error);
                    return null;
                }
            });

            const fetchedProducts = await Promise.all(productPromises);
            console.log("All products fetched:", fetchedProducts.filter(p => p !== null).length, "valid products");

            // Filter out null/undefined products
            const validProducts = fetchedProducts.filter(product => product !== null);
            console.log("Setting products:", validProducts.map(p => ({id: p._id, name: p.productName})));
            setProducts(validProducts);

        } catch (error) {
            console.error("Failed to fetch wishlist products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
            console.log("Loading finished");
        }
    };

    // Toggle wishlist with optimistic UI update
    const toggleWishlist = async (productId) => {
        let currentUser = getLoggedInUser();

        // Not logged in → Google login first
        if (!currentUser || !currentUser.email) {
            try {
                currentUser = await loginWithGoogle();
                if (!currentUser || !currentUser.email) {
                    console.error("Failed to get user after login");
                    return;
                }
            } catch (error) {
                console.error("Login failed:", error);
                return; // User cancelled login
            }
        }

        const idStr = String(productId);
        const prevWishlist = [...wishlistProductIds];
        const prevProducts = [...products];

        // Optimistic UI update - remove from both states
        const nextWishlist = prevWishlist.filter(id => id !== idStr);
        const nextProducts = prevProducts.filter(p => p._id !== productId);
        
        setWishlistProductIds(nextWishlist);
        setProducts(nextProducts);
        localStorage.setItem("wishlist", JSON.stringify(nextWishlist));

        try {
            const res = await fetch("/api/wishlist", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userEmail: currentUser.email,
                    productId,
                }),
            });

            if (!res.ok) {
                // Revert on error
                setWishlistProductIds(prevWishlist);
                setProducts(prevProducts);
                localStorage.setItem("wishlist", JSON.stringify(prevWishlist));
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update wishlist");
            }
            
            console.log("Successfully removed from wishlist");
        } catch (error) {
            console.error("Wishlist update error:", error);
            // Already reverted in the error case above
        }
    };

    // Show loading while auth is initializing
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-back">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Show login prompt if not logged in
    if (!isLoggedIn && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-back ci">
                <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
                    <svg
                        className="w-24 h-24 mx-auto text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="text-2xl font-bold mb-4 text-black">Login Required</h2>
                    <p className="mb-6 text-gray-600">Please login to view your wishlist</p>
                    <button
                        onClick={() => loginWithGoogle()}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Login with Google
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-back py-8 min-h-screen ci">
            <div className="container mx-auto px-4 md:px-6">
                <motion.h1 
                    className="text-3xl font-bold text-center mb-12 text-black"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Your Wishlist
                </motion.h1>

                {loading ? (
                    <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="overflow-hidden">
                                <div className="relative w-full h-60 md:h-72 overflow-hidden">
                                    <Skeleton className="w-full h-full" />
                                </div>
                                <div className="py-4 px-1 text-start">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <div className="flex justify-start items-center space-x-2 mt-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
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
                            <h3 className="text-2xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
                            <p className="text-gray-500 mb-6">
                                Start adding products you love to your wishlist
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
                                Browse Products
                            </Link>
                        </motion.div>
                    </div>
                ) : (
                    <motion.div 
                        className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {products.map((product) => {
                            const isInWishlist = wishlistProductIds.includes(String(product._id));
                            
                            return (
                                <motion.div
                                    key={product._id}
                                    className="  overflow-hidden hover:shadow-xl transition-shadow relative group"
                                    whileHover={{ y: -5 }}
                                >
                                    <button
                                        onClick={() => toggleWishlist(product._id)}
                                        className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full backdrop-blur-sm transition-all hover:bg-white"
                                    >
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className={`h-6 w-6 transition-colors ${isInWishlist ? "text-red-500 fill-current" : "text-black stroke-current fill-none"}`}
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
                                            />
                                        </svg>
                                    </button>

                                    <Link href={`/products/${product._id}`}>
                                        <div className="relative h-60 md:h-72 overflow-hidden">
                                            <motion.img 
                                                src={product.img1}
                                                alt={product.productName}
                                                className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500"
                                                initial={{ opacity: 1 }}
                                                whileHover={{ opacity: 0 }}
                                            />
                                            {product.img2 && (
                                                <motion.img 
                                                    src={product.img2}
                                                    alt={`${product.productName} Hover`}
                                                    className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500"
                                                    initial={{ opacity: 0 }}
                                                    whileHover={{ opacity: 1 }}
                                                />
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-sm md:text-base text-black mb-1 line-clamp-1">
                                                {product.productName}
                                            </h3>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-black font-bold text-sm md:text-base">
                                                    ₹{product.originalPrice?.toLocaleString() || product.totalPrice?.toLocaleString()}
                                                </span>
                                                {product.strikeoutPrice && (
                                                    <span className="text-gray-400 line-through text-xs md:text-sm">
                                                        ₹{product.totalPrice.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}