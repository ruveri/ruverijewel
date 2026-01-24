"use client";

import { useState, useEffect } from "react";
import { useGoogleAuth } from "../components/useGoogleAuth";

export default function LoginStep({ onNext }) {
  const { loginWithGoogle, user, isLoggedIn, loading: authLoading } = useGoogleAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If user is already logged in, automatically move to next step
  useEffect(() => {
    if (isLoggedIn && user) {
      // Add a small delay to show the logged-in state
      const timer = setTimeout(() => {
        onNext(1, { 
          name: user.name, 
          email: user.email,
          photo: user.photo,
          uid: user.uid
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, user, onNext]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      await loginWithGoogle();
      // Login successful, the useEffect will handle moving to next step
    } catch (err) {
      console.error("Google login error:", err);
      setError("Failed to login. Please try again.");
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="space-y-5 px-1 mx-auto">
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-600">Checking login status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-1 mx-auto">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Login to Continue</h2>
        <p className="text-sm text-gray-600 mt-1">
          Please login with Google to proceed with your purchase.
        </p>
      </div>

      <div className="space-y-4">
        {/* Show user info if already logged in */}
        {isLoggedIn && user ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              {user.photo && (
                <img 
                  src={user.photo} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-green-700">
                Login successful! Redirecting...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Privacy notice */}
            <div className="text-xs text-gray-500 text-center pt-2">
              <p>We only use your email to manage your orders. We never share your data.</p>
              <p className="mt-1">By continuing, you agree to our Terms & Privacy Policy</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}