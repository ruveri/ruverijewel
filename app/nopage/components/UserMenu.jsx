"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiUser } from "react-icons/fi";

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "@/app/lib/firebase";

export default function UserMenu({ user, setUser, showUserPopup, setShowUserPopup }) {
    const popupRef = useRef(null);

    // 👇 Handle click outside to close popup
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setShowUserPopup(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowUserPopup]);


    // 🟢 Login using Google
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const loggedUser = result.user;

            // Save data
            localStorage.setItem("userEmail", loggedUser.email);
            localStorage.setItem("userName", loggedUser.displayName);
            localStorage.setItem("userPhoto", loggedUser.photoURL);

            setUser(loggedUser);
            setShowUserPopup(false);
        } catch (err) {
            console.error("Google login error:", err);
        }
    };

    // 🔴 Logout
    const handleLogout = () => {
        signOut(auth);
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userPhoto");
        setUser(null);
        setShowUserPopup(false);
    };

    return (
        <div className="cursor-pointer relative">
            {/* 👤 ICON OR PHOTO */}
            <div onClick={() => (!user ? handleGoogleSignIn() : setShowUserPopup(prev => !prev))}>
                {user ? (
                    <Image
                        src={user.photoURL}
                        width={32}
                        height={32}
                        alt="user"
                        className="rounded-full border border-red-900"
                    />
                ) : (
                    <FiUser
                        className={`w-5 h-5 `}
                    />

                )}
            </div>

            {/* 👇 DROPDOWN */}
            <AnimatePresence>
                {user && showUserPopup && (
                    <motion.div
                        ref={popupRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-10 z-50 w-48 bg-red-200/20 backdrop-blur-lg border border-white/10 shadow-xl rounded-md overflow-hidden"
                    >
                        <div className="px-4 py-3 text-sm font-semibold text-white border-b">
                            👋 Hi, {user.displayName.split(" ")[0]}
                        </div>

                        <Link
                            href="/my-orders"
                            className="block px-4 py-3 text-sm text-white hover:bg-red-200/30 transition"
                            onClick={() => setShowUserPopup(false)}
                        >
                            🧾 My Orders
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 text-sm text-white hover:bg-red-200/30 transition"
                        >
                            🚪 Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
