"use client";
import { createContext, useContext, useEffect, useState, useRef } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const hasSavedAbandonedCartRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const hasUserLoggedInRef = useRef(false);
  const unloadHandlerRef = useRef(null); // Ref to store the unload handler

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(savedCart);
  }, []);

  // Save cart to localStorage when cart changes and handle save logic
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    const user = localStorage.getItem("google_user");
    if (user) {
      hasUserLoggedInRef.current = true;
      handleAbandonedCartSaveLogic(cart);
    }
  }, [cart]);

  // Detect login after cart is added, then start delayed save
  useEffect(() => {
    const checkUserLogin = () => {
      const storedUser = localStorage.getItem("google_user");
      if (storedUser && Object.keys(cart).length && !hasUserLoggedInRef.current) {
        hasUserLoggedInRef.current = true;
        handleAbandonedCartSaveLogic(cart); // Start 15 min timer after login
      }
    };

    const handleStorageChange = () => checkUserLogin();
    const interval = setInterval(checkUserLogin, 5000);

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [cart]);

  const getShippingParams = () => ({
    weight: process.env.NEXT_PUBLIC_SHIPPING_WEIGHT || 1000,
    length: process.env.NEXT_PUBLIC_SHIPPING_LENGTH || 30,
    width: process.env.NEXT_PUBLIC_SHIPPING_WIDTH || 30,
    height: process.env.NEXT_PUBLIC_SHIPPING_HEIGHT || 30,
  });

  const getTotalItems = () => Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => Object.values(cart).reduce((total, item) => total + item.price * item.quantity, 0);

  const addToCart = (productId, productData) => {
    setCart((prev) => {
      const existing = prev[productId] || { quantity: 0 };

      const updatedCart = {
        ...prev,
        [productId]: {
          ...productData,
          // Ensure productId is always included in the product data
          id: productId,
          quantity: existing.quantity + 1,
          weight: productData.weight,
          dimensions: productData.dimensions,
          selectedChain: productData.selectedChain || existing.selectedChain || null,
        },
      };

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prev) => {
      const updatedCart = { ...prev };

      if (newQuantity <= 0) {
        delete updatedCart[productId];
      } else {
        updatedCart[productId] = {
          ...updatedCart[productId],
          // Ensure productId is preserved
          id: productId,
          quantity: newQuantity,
          selectedChain: prev[productId]?.selectedChain || null,
        };
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Define handleUnload as a standalone function
  const handleUnload = () => {
    if (!hasSavedAbandonedCartRef.current) {
      const storedUser = localStorage.getItem("google_user");
      if (storedUser) {
        const { name, email } = JSON.parse(storedUser);
        saveAbandonedCart(name, email, cart);
        hasSavedAbandonedCartRef.current = true;
      }
    }
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart");

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    // Remove the unload event listener
    if (unloadHandlerRef.current) {
      window.removeEventListener("beforeunload", unloadHandlerRef.current);
      unloadHandlerRef.current = null;
    }

    hasSavedAbandonedCartRef.current = false;
    hasUserLoggedInRef.current = false;
  };

  const handleAbandonedCartSaveLogic = (currentCart) => {
    const storedUser = localStorage.getItem("google_user");
    if (!storedUser || !Object.keys(currentCart).length) return;

    const { name, email } = JSON.parse(storedUser);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      if (!hasSavedAbandonedCartRef.current) {
        saveAbandonedCart(name, email, currentCart);
        hasSavedAbandonedCartRef.current = true;
      }
    }, 15 * 60 * 1000); // 15 min delay after login

    // Remove existing event listener if any
    if (unloadHandlerRef.current) {
      window.removeEventListener("beforeunload", unloadHandlerRef.current);
    }

    // Create a wrapper function for the unload handler
    const unloadHandler = () => {
      if (!hasSavedAbandonedCartRef.current) {
        saveAbandonedCart(name, email, currentCart);
        hasSavedAbandonedCartRef.current = true;
      }
    };

    // Store the handler in ref
    unloadHandlerRef.current = unloadHandler;
    
    // Add new event listener
    window.addEventListener("beforeunload", unloadHandlerRef.current);
  };

  const saveAbandonedCart = async (name, email, cartData) => {
    if (!email || !Object.keys(cartData).length) return;

    try {
      await fetch("/api/save-abandoned-cart", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY 
        },
        body: JSON.stringify({ 
          name, 
          email, 
          cart: cartData 
        }),
      });
      console.log("✅ Abandoned cart saved");
    } catch (err) {
      console.error("❌ Failed to save abandoned cart", err);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      if (unloadHandlerRef.current) {
        window.removeEventListener("beforeunload", unloadHandlerRef.current);
      }
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getShippingParams,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);