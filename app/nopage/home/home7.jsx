"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const testimonials = [
  {
    name: "Sumaiya Mita",
    role: "Happy Customer",
    quote:
      "Outstanding customer support! They went above and beyond to help me resolve my issue. I felt valued as a customer, and their commitment to ensuring my satisfaction left a lasting impression.",
  },
  {
    name: "Ayesha Khan",
    role: "Verified Buyer",
    quote:
      "The quality exceeded my expectations. From packaging to delivery, everything felt premium and thoughtfully designed.",
  },
  {
    name: "Noor Fatima",
    role: "Loyal Customer",
    quote:
      "Absolutely beautiful craftsmanship. I receive compliments every time I wear it. Highly recommended!",
  },
];

// Animation variants with direction
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function CustomerTestimonials() {
  const [[index, direction], setIndex] = useState([0, 0]);

  const paginate = (newDirection) => {
    setIndex(([prev]) => {
      const nextIndex =
        newDirection === 1
          ? (prev + 1) % testimonials.length
          : prev === 0
          ? testimonials.length - 1
          : prev - 1;

      return [nextIndex, newDirection];
    });
  };

  const current = testimonials[index];

  return (
    <section className="w-full bg-back py-20 ci">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl lg:text-5xl font-semibold leading-tight">
              From our <br /> Customers
            </h2>

            <p className="text-gray-600 max-w-md leading-relaxed">
              Explore firsthand accounts of satisfaction, inspiration, and the
              impact of our offerings straight from the voices of those we serve.
            </p>
          </motion.div>

          {/* CENTER IMAGE (STATIC) */}
          <div className="flex justify-center">
            <div className="relative w-[320px] h-[420px] lg:w-[360px] lg:h-[440px] overflow-hidden">
              <Image
                src="/jewelry/h1.JPG"
                alt="Customer"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* RIGHT (ANIMATED CONTENT ONLY) */}
          <div className="space-y-6 overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <p className="text-gray-800 text-lg leading-relaxed mb-6">
                  “{current.quote}”
                </p>

                <div>
                  <h4 className="text-xl font-semibold">
                    {current.name}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {current.role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* NAVIGATION */}
            <div className="flex gap-4 pt-6">
              <motion.button
                onClick={() => paginate(-1)}
                
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center text-xl"
              >
                ‹
              </motion.button>

              <motion.button
                onClick={() => paginate(1)}
                
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center text-xl"
              >
                ›
              </motion.button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
