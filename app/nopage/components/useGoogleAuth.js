"use client";

import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../../lib/firebase";
import { useState, useEffect, useCallback } from "react";

/* ---------------------------------------------------------
   Google Auth Hook
--------------------------------------------------------- */
export function useGoogleAuth() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first for faster initial load
    const storedUser = localStorage.getItem("google_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photo: firebaseUser.photoURL,
        };
        
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem("google_user", JSON.stringify(userData));
      } else {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("google_user");
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photo: firebaseUser.photoURL,
      };

      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getLoggedInUser = useCallback(() => {
    if (typeof window === "undefined") return null;
    
    // Return from state first, then fallback to localStorage
    if (user) return user;
    
    const stored = localStorage.getItem("google_user");
    return stored ? JSON.parse(stored) : null;
  }, [user]);

  return {
    loginWithGoogle,
    logout,
    getLoggedInUser,
    user,
    isLoggedIn,
    loading,
  };
}