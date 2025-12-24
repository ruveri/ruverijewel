"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 2000); // 2 sec delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-screen h-[50vh] lg:h-[80vh] overflow-hidden bg-white">
      <AnimatePresence>
        {show && (
          <motion.div
            className="absolute inset-0"
            initial={{
              opacity: 0,
              y: "100%",     // 👈 starts from bottom of screen
              scale: 1.25,   // zoom-in start
            }}
            animate={{
              opacity: 1,
              y: "0%",       // 👈 moves to center
              scale: 1,      // zoom-out
            }}
            transition={{
              duration: 1.8,
              ease: [0.22, 1, 0.36, 1], // smooth cinematic easing
            }}
          >
            <Image
              src="/model1.webp"
              alt="Full Screen Image"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
