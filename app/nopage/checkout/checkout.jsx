"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import LoginStep from "./loginstep";
import AddressStep from "./addressstep";
import PaymentStep from "./paymentstep";
import { useGoogleAuth } from "../components/useGoogleAuth";

export default function CheckoutPopup({ onClose }) {
    const [step, setStep] = useState(1);
    const [isStepCompleted, setIsStepCompleted] = useState({
        1: false,
        2: false,
        3: false,
    });
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        photo: "",
        uid: "",
        address: {},
    });
    
    const { user, isLoggedIn } = useGoogleAuth();

    // Auto-skip to step 2 if user is already logged in
    useEffect(() => {
        if (isLoggedIn && user && step === 1) {
            setUserData({
                name: user.name || "",
                email: user.email || "",
                photo: user.photo || "",
                uid: user.uid || "",
                address: {}
            });
            setIsStepCompleted(prev => ({ ...prev, 1: true }));
            setStep(2);
        }
    }, [isLoggedIn, user, step]);

    const completeStep = (stepNum, data) => {
        setIsStepCompleted((prev) => ({ ...prev, [stepNum]: true }));
        if (data) {
            setUserData((prev) => ({ ...prev, ...data }));
        }
        if (stepNum < 3) {
            setStep(stepNum + 1);
        }
    };

    const progressPercent = (step / 3) * 100;

    return (
        <div className="z-50 flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative bg-white rounded-xl w-full max-w-xl mx-auto h-[70vh] flex flex-col overflow-hidden"
            >
                {/* Stepper */}
                <div className="py-5">
                    <div className="flex justify-between items-center mb-3">
                        {["Login", "Address", "Payment"].map((label, idx) => {
                            const currentStep = idx + 1;
                            const isComplete = isStepCompleted[currentStep];
                            const isClickable = currentStep <= step || isComplete;

                            return (
                                <button
                                    key={label}
                                    className="flex items-center gap-2 focus:outline-none"
                                    onClick={() => {
                                        if (isClickable) setStep(currentStep);
                                    }}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold transition-all
                                            ${isComplete
                                                ? "bg-green-600 text-white"
                                                : step === currentStep
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-300 text-gray-700"
                                            }`}
                                    >
                                        {isComplete ? <CheckCircleIcon className="h-4 w-4" /> : currentStep}
                                    </div>
                                    <span
                                        className={`text-sm font-medium transition-colors
                                            ${step === currentStep ? "text-blue-600" : "text-gray-600"}
                                        `}
                                    >
                                        {label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="bg-blue-600 h-full"
                        />
                    </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 overflow-y-auto px-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            {step === 1 && (
                                <LoginStep
                                    onNext={completeStep}
                                />
                            )}
                            {step === 2 && <AddressStep onNext={completeStep} />}
                            {step === 3 && <PaymentStep userData={userData} />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-5 pt-4 border-t mt-auto">
                    <p className="text-xs text-center text-gray-500 mb-2">
                        Payments are 100% secure and encrypted. Powered by leading gateways.
                    </p>
                    <div className="flex justify-center items-center gap-3 flex-wrap">
                        <img src="/paytm.svg" alt="Paytm" className="w-8 h-8" />
                        <img src="/gpay.svg" alt="Google Pay" className="w-8 h-8" />
                        <img src="/phonepe.svg" alt="PhonePe" className="w-8 h-8" />
                        <img src="/visa.svg" alt="Visa" className="w-10 h-8" />
                        <img src="/mastercard.svg" alt="Mastercard" className="w-10 h-8" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}