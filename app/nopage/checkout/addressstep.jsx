"use client";
import { useState, useEffect, useCallback } from "react";
import {
  CheckCircleIcon,
  MapPinIcon,
  LockClosedIcon,
  XCircleIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import { useGoogleAuth } from "../../nopage/components/useGoogleAuth";
import { COUNTRIES } from "../../lib/countries"; // Import the countries list

export default function AddressStep({ onNext }) {
  const { getTotalItems } = useCart();
  const { user, isLoggedIn, logout, loginWithGoogle } = useGoogleAuth();
  const quantity = getTotalItems();
  
  const [country, setCountry] = useState("IN");
  const [locationOptions, setLocationOptions] = useState([]);
  const [pincode, setPincode] = useState("");
  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState({ city: "", state: "", line1: "" });
  const [deliveryInfo, setDeliveryInfo] = useState({
    serviceable: null,
    shippingCharge: 0,
    expectedDate: "",
  });
  const [loading, setLoading] = useState({
    checking: false,
    saving: false,
    loggingOut: false,
    loggingIn: false,
    fetching: false
  });

  // Fetch saved address for logged-in user
  useEffect(() => {
    const fetchAddress = async () => {
      if (!isLoggedIn || !user?.email) return;

      setLoading(prev => ({ ...prev, fetching: true }));
      try {
        const res = await fetch(`/api/get-address?email=${user.email}&googleId=${user.uid}`);
        
        if (res.ok) {
          const data = await res.json();
          
          if (data.success && data.address) {
            setCountry(data.address.country || "IN");
            setPincode(data.address.pincode || "");
            setAddress({
              city: data.address.city || "",
              state: data.address.state || "",
              line1: data.address.fullAddress || "",
            });
          }
        }
      } catch (err) {
        console.log("No saved address found:", err.message);
      } finally {
        setLoading(prev => ({ ...prev, fetching: false }));
      }
    };

    fetchAddress();
  }, [isLoggedIn, user]);

  // Check pincode serviceability
  const checkPincodeServiceability = useCallback(async (pincodeToCheck, selectedCountry) => {
    if (!pincodeToCheck || pincodeToCheck.length < 3) return;

    setLoading(prev => ({ ...prev, checking: true }));
    try {
      const url = selectedCountry === "IN"
        ? `/api/shiprocket-pincode-check?pincode=${pincodeToCheck}&quantity=${quantity}&country=${selectedCountry}`
        : `/api/shiprocket-pincode-check?pincode=${pincodeToCheck}&country=${selectedCountry}`;

      const serviceRes = await fetch(url, {
        headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }
      });
      
      if (!serviceRes.ok) throw new Error("Service check failed");
      
      const serviceData = await serviceRes.json();
      
      setDeliveryInfo({
        serviceable: serviceData.serviceable,
        shippingCharge: serviceData.shippingCharge || 0,
        expectedDate: serviceData.expectedDate || "",
      });

      if (serviceData.serviceable) {
        setErrors(prev => ({ ...prev, pincode: "", serviceable: "" }));
      }

      // Set location options for international addresses
      if (serviceData.locations && serviceData.locations.length > 0) {
        setLocationOptions(serviceData.locations);
        
        // Autofill if not already set
        if (!address.city || !address.state) {
          setAddress(prev => ({
            ...prev,
            city: serviceData.locations[0].city,
            state: serviceData.locations[0].state,
          }));
        }
      } else {
        setLocationOptions([]);
      }

    } catch (error) {
      console.log("Pincode check failed:", error.message);
      setDeliveryInfo({
        serviceable: false,
        shippingCharge: 0,
        expectedDate: "",
      });
      setLocationOptions([]);
    } finally {
      setLoading(prev => ({ ...prev, checking: false }));
    }
  }, [quantity, address.city, address.state]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (pincode.length >= 3) {
        checkPincodeServiceability(pincode, country);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [pincode, country, checkPincodeServiceability]);

  // Reset pincode when country changes
  useEffect(() => {
    setPincode("");
    setAddress({ city: "", state: "", line1: "" });
    setLocationOptions([]);
    setDeliveryInfo({ serviceable: null, shippingCharge: 0, expectedDate: "" });
    setErrors({});
  }, [country]);

  const validateForm = () => {
    const newErrors = {};

    if (!isLoggedIn || !user?.email) {
      newErrors.email = "Please login to continue";
    }

    if (!pincode || pincode.length < 3) {
      newErrors.pincode = "Valid postal/pin code is required";
    }

    if (!deliveryInfo.serviceable) {
      newErrors.serviceable = "Sorry, we don't deliver to this area";
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!address.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!address.line1.trim()) {
      newErrors.line1 = "Complete address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!isLoggedIn || !user?.email || !user?.uid) {
      setErrors({ email: "Please login to continue" });
      return;
    }

    if (!validateForm()) return;

    setLoading(prev => ({ ...prev, saving: true }));
    try {
      const saveRes = await fetch("/api/save-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({
          email: user.email,
          googleId: user.uid,
          name: user.name,
          photo: user.photo,
          address: {
            pincode,
            city: address.city,
            state: address.state,
            fullAddress: address.line1,
            country: country.toUpperCase()
          },
        }),
      });

      const result = await saveRes.json();

      if (!saveRes.ok) {
        throw new Error(result.error || result.details || "Failed to save address");
      }

      onNext(2, {
        address: { ...address, pincode, country: country.toUpperCase() },
        shippingCharge: deliveryInfo.shippingCharge,
        email: user.email,
        name: user.name,
        photo: user.photo,
        googleId: user.uid,
      });
    } catch (error) {
      console.error("Address save failed:", error);
      setErrors({ serviceable: error.message });
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const handleLogout = async () => {
    setLoading(prev => ({ ...prev, loggingOut: true }));
    try {
      await logout();
      setCountry("IN");
      setPincode("");
      setAddress({ city: "", state: "", line1: "" });
      setLocationOptions([]);
      setDeliveryInfo({ serviceable: null, shippingCharge: 0, expectedDate: "" });
      setErrors({});
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(prev => ({ ...prev, loggingOut: false }));
    }
  };

  const handleLogin = async () => {
    setLoading(prev => ({ ...prev, loggingIn: true }));
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ email: "Login failed. Please try again." });
    } finally {
      setLoading(prev => ({ ...prev, loggingIn: false }));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="mx-auto space-y-6 px-1">
        <div className="text-center py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <LockClosedIcon className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Login Required
            </h3>
            <p className="text-gray-600 mb-4">
              Please login with Google to continue with your order.
            </p>
            <button
              onClick={handleLogin}
              disabled={loading.loggingIn}
              className="w-full flex items-center justify-center gap-3 bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading.loggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Login with Google</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Part 2 - JSX Return (add after Part 1)

  return (
    <div className="mx-auto space-y-6 px-1 ci">
      {/* User Info Display */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account <span className="text-green-600">✓ Connected</span>
        </label>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {user.photo && (
              <img
                src={user.photo}
                alt={user.name}
                className="w-10 h-10 rounded-full shrink-0"
              />
            )}

            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-600 break-all">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={loading.loggingOut}
                  className="w-full sm:w-auto px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {loading.loggingOut ? "Logging out..." : "Use Different Account"}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Orders and delivery updates will be sent to this email
              </p>
            </div>
          </div>
        </div>

        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Country Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country / Region <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <GlobeAltIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading.fetching}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pincode Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {country === "IN" ? "PIN Code" : "Postal / ZIP Code"} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={pincode}
            onChange={(e) => {
              const value = country === "IN" 
                ? e.target.value.replace(/\D/g, "").slice(0, 6)
                : e.target.value.toUpperCase().slice(0, 10);
              setPincode(value);
              if (errors.pincode) setErrors(prev => ({ ...prev, pincode: "" }));
            }}
            placeholder={country === "IN" ? "Enter 6-digit pincode" : "Enter postal/ZIP code"}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.pincode ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading.fetching}
          />
        </div>

        {loading.checking && (
          <p className="text-sm text-blue-600 mt-1 animate-pulse">
            Checking serviceability...
          </p>
        )}

        {errors.pincode && (
          <p className="text-sm text-red-600 mt-1">{errors.pincode}</p>
        )}
      </div>

      {/* Address Form */}
      {pincode.length >= 3 && (
        <div className={`space-y-4 animate-fade-in ${
          deliveryInfo.serviceable === false ? 'border-l-4 border-red-500 pl-4' : ''
        }`}>
          
          {deliveryInfo.serviceable === false && (
            <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3">
              <XCircleIcon className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">
                  Sorry, we don&apos;t deliver to this area
                </p>
                <p className="text-sm text-red-700">
                  Please try a different {country === "IN" ? "pincode" : "postal code"}
                </p>
              </div>
            </div>
          )}

          {deliveryInfo.serviceable && (
            <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">
                  We deliver to your area!
                </p>
                <p className="text-sm text-green-700">
                  🚚 Estimated delivery: <strong>{deliveryInfo.expectedDate}</strong>
                  {deliveryInfo.shippingCharge > 0 ? (
                    <>. Shipping: ₹{deliveryInfo.shippingCharge}</>
                  ) : (
                    <>. Free shipping</>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                {locationOptions.length > 0 ? (
                  <select
                    value={address.city}
                    onChange={(e) => {
                      const selectedOption = locationOptions.find(
                        opt => opt.city === e.target.value
                      );
                      setAddress(prev => ({
                        ...prev,
                        city: selectedOption?.city || "",
                        state: selectedOption?.state || "",
                      }));
                      if (errors.city) setErrors(prev => ({ ...prev, city: "" }));
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select City</option>
                    {locationOptions.map((option, index) => (
                      <option key={index} value={option.city}>
                        {option.city}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => {
                      setAddress(prev => ({ ...prev, city: e.target.value }));
                      if (errors.city) setErrors(prev => ({ ...prev, city: "" }));
                    }}
                    placeholder="Enter City"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
                {errors.city && (
                  <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State / Province <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => {
                    setAddress(prev => ({ ...prev, state: e.target.value }));
                    if (errors.state) setErrors(prev => ({ ...prev, state: "" }));
                  }}
                  placeholder="Enter State/Province"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.state && (
                  <p className="text-sm text-red-600 mt-1">{errors.state}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={address.line1}
                onChange={(e) => {
                  setAddress(prev => ({ ...prev, line1: e.target.value }));
                  if (errors.line1) setErrors(prev => ({ ...prev, line1: "" }));
                }}
                placeholder="House No., Street Name, Area, Landmark"
                rows="3"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.line1 ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.line1 && (
                <p className="text-sm text-red-600 mt-1">{errors.line1}</p>
              )}
            </div>

            {errors.serviceable && (
              <p className="text-sm text-red-600 mt-1">{errors.serviceable}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!deliveryInfo.serviceable || loading.saving}
              className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                deliveryInfo.serviceable && !loading.saving
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading.saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <LockClosedIcon className="h-5 w-5" />
                  {deliveryInfo.serviceable
                    ? "Continue to Secure Payment"
                    : `Enter a valid ${country === "IN" ? "pincode" : "postal code"} to continue`}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}