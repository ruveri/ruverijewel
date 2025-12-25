"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const text = "Timeless Fine Jewelry";

export default function Page() {
  return (
    <nav className="w-full bg-[#FFF5F5]">
      <div className="mt-4 mb-4 lg:mb-0 flex flex-col items-center justify-center gap-2 px-4">

        {/* Tagline – Letter by Letter */}
        <motion.p
          className="text-xs sm:text-sm tracking-[0.25em] sm:tracking-[0.3em] text-gray-600 uppercase text-center flex"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.03, // speed between letters
              },
            },
          }}
        >
          {text.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.p>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.5,   // starts after text finishes
            duration: 1.2,
            ease: "easeOut",
          }}
          className="
            w-[70vw] 
            sm:w-[50vw] 
            md:w-[50vw] 
            lg:w-[30vw]
          "
        >
          <Image
            src="/logo.webp"
            alt="Jewelry Brand Logo"
            width={400}
            height={200}
            priority
            className="w-full h-auto"
          />
        </motion.div>

      </div>
    </nav>
  );
}
