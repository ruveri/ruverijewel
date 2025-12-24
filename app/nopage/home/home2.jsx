"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const imageZoom = {
  hidden: { scale: 1.5 },
  visible: {
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function CategoryBanner() {
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    // Only delay on mobile (screen width < 768px)
    if (window.innerWidth < 768) {
      const timer = setTimeout(() => {
        setShowComponent(true);
      }, 1000); // 1 second delay
      return () => clearTimeout(timer);
    } else {
      // Show immediately on desktop
      setShowComponent(true);
    }
  }, []);

  if (!showComponent) return null; // Blank screen until state is true

  return (
    <section className="w-full grid grid-cols-2 overflow-hidden">
      
      {/* LEFT BLOCK */}
      <div className="relative h-[30vh] md:h-[70vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          variants={imageZoom}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <Image
            src="/model2.webp"
            alt="Engagement Rings"
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Overlay Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-14 bg-black/10">
          <h2 className="text-white text-md lg:text-3xl md:text-4xl font-serif tracking-wide mb-4">
            ENGAGEMENT RINGS
          </h2>

          <Link
            href="#"
            className="bg-white text-black px-4 lg:px-8 py-2 lg:py-3 text-sm tracking-widest
                       hover:bg-black hover:text-white transition"
          >
            SHOP NOW
          </Link>
        </div>
      </div>

      {/* RIGHT BLOCK */}
      <div className="relative h-[30vh] md:h-[70vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          variants={imageZoom}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <Image
            src="/model3.webp"
            alt="Diamond Earrings"
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Overlay Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-14 bg-black/10">
          <h2 className="text-white text-md lg:text-3xl md:text-4xl font-serif tracking-wide mb-4">
            DIAMOND EARRINGS
          </h2>

          <Link
            href="#"
            className="bg-white text-black px-4 lg:px-8 py-2 lg:py-3 text-sm tracking-widest
                       hover:bg-black hover:text-white transition"
          >
            SHOP NOW
          </Link>
        </div>
      </div>

    </section>
  );
}
