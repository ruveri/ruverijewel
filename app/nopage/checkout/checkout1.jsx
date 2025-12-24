"use client";

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

import Link from 'next/link';

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const calculateTotals = () => {
        const subtotal = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 500 ? 0 : 70;
        return { subtotal, shipping, total: subtotal + shipping };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        // Validation
        if (!/^\d{10}$/.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number');
            setLoading(false);
            return;
        }
    
        if (!/^\d{6}$/.test(formData.pincode)) {
            setError('Please enter a valid 6-digit pincode');
            setLoading(false);
            return;
        }
    
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    cart: Object.values(cart),
                    totals: calculateTotals()
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || 'Order submission failed');
            }
    
            clearCart();
            setSuccess(true); // ✅ This will now correctly show success screen
        } catch (err) {
            setError(err.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    

    if (success) {
        return (
            <div className="min-h-screen bg-c1 flex flex-col items-center justify-center p-4">
               
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center max-w-2xl"
                >
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <h1 className="text-2xl font-bold text-c4 mb-4">🎉 Order Placed Successfully!</h1>
                        <p className="text-gray-600 mb-6">
                            Thank you for your purchase. We&apos;ve sent a confirmation email to {formData.email}.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block bg-c4 text-white px-6 py-2 rounded-lg hover:bg-c4/90 transition-all"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-c1">
           
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid lg:grid-cols-2 gap-8"
                >
                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-xl shadow-sm h-fit lg:sticky lg:top-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            {Object.values(cart).map(item => (
                                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                                    <div>
                                        <h3 className="font-medium text-gray-800">{item.productName}</h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        {item.name && <p className="text-sm text-gray-500">Engraved: {item.name}</p>}
                                    </div>
                                    <p className="font-medium text-c4">Rs. {item.price * item.quantity}</p>
                                </div>
                            ))}
                            <div className="space-y-3 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">Rs. {calculateTotals().subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {calculateTotals().shipping === 0 ? 'FREE' : `Rs. ${calculateTotals().shipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t pt-3">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-lg text-c4">Rs. {calculateTotals().total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Details</h2>
                        
                        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">{error}</div>}

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c4 focus:border-c4"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c4 focus:border-c4"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c4 focus:border-c4"
                                        pattern="[0-9]{10}"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c4 focus:border-c4"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c4 focus:border-c4"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c4 focus:border-c4"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c4 focus:border-c4"
                                        pattern="[0-9]{6}"
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-c4 text-white py-3 rounded-lg font-bold mt-4 hover:bg-c4/90 transition-colors disabled:opacity-70"
                            >
                                {loading ? 'Placing order...' : 'Place Order'}
                            </motion.button>

                            <p className="text-center text-sm text-gray-500">
                                Your personal data will be used to process your order and for other purposes described in our privacy policy.
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}