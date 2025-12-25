"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function JewelryEditorialOverlap() {
    return (
        <section className="relative w-full bg-back overflow-hidden ci">
            {/* ================= HERO ================= */}
            <div className="relative w-full h-[420px] md:h-[520px]">
                <Image
                    src="/backimg.webp"
                    alt="Custom Jewelry"
                    fill
                    priority
                    className="object-cover"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Hero content */}
                <div className="absolute inset-0 flex pb-16 md:pb-0 items-center justify-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9 }}
                        className="max-w-3xl text-white"
                    >
                        <h1 className="text-[24px] md:text-[44px] font-light tracking-wide text-white">
                            Explore Our Men&apos;s Collection
                        </h1>

                        <p className="mt-4 text-[12px] sm:text-base text-white/90 leading-relaxed">
                            Discover bold and sophisticated pieces designed exclusively for men.
                            From timeless classics to modern statement pieces, elevate your style
                            with Jullaby&apos;s men&apos;s collection.
                        </p>


                        <button className="mt-6 rounded-full bg-white text-black px-6 py-2 text-sm font-medium hover:bg-black hover:text-white transition">
                            Shop Now
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* ================= OVERLAPPING CARDS ================= */}
            <div className="relative z-10 max-w-5xl mx-auto px-4">
                {/* White frame container */}
                <div className="-mt-28 md:-mt-32 bg-white p-2 md:p-2 border border-white shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

                        {/* Engagement */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-square"
                        >
                            <Image
                                src="/front1.webp"
                                alt="Rings"
                                fill
                                className="object-cover"
                            />

                            <div className="absolute inset-0 bg-black/25" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <h3 className="text-[24px] md:text-[28px] font-light">
                                    Rings
                                </h3>

                                <button className="mt-4 rounded-full bg-white text-black px-5 py-2 text-sm hover:bg-black hover:text-white transition">
                                    View Product
                                </button>
                            </div>
                        </motion.div>


                        {/* Wedding */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="relative aspect-square"
                        >
                            <Image
                                src="/front2.webp"
                                alt="Necklace"
                                fill
                                className="object-cover"
                            />

                            <div className="absolute inset-0 bg-black/25" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <h3 className="text-[24px] md:text-[28px] font-light">
                                    Necklace
                                </h3>

                                <button className="mt-4 rounded-full bg-white text-black px-5 py-2 text-sm hover:bg-black hover:text-white transition">
                                    View Product
                                </button>
                            </div>
                        </motion.div>


                    </div>
                </div>
            </div>

            {/* Bottom spacing */}
            <div className="h-20" />
        </section>
    );
}
