"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import RingImg from "@/public/jewelry/ring.png";
import BanglesImg from "@/public/jewelry/bangles.jpg";
import BraceletsImg from "@/public/jewelry/bracelets.jpg";
import ChainsImg from "@/public/jewelry/chains.jpg";
import EarringsImg from "@/public/jewelry/earrings.jpg";
import NecklaceImg from "@/public/jewelry/necklace.jpg";
import PendentsImg from "@/public/jewelry/pendents.jpg";
import MenCollectionImg from "@/public/jewelry/men-collection.jpg";

const items = [
  { name: "Rings", img: RingImg, href: "/rings" },
  { name: "Bangles", img: BanglesImg, href: "/bangles" },
  { name: "Bracelets", img: BraceletsImg, href: "/bracelets" },
  { name: "Chains", img: ChainsImg, href: "/chains" },
  { name: "Earrings", img: EarringsImg, href: "/earrings" },
  { name: "Necklace", img: NecklaceImg, href: "/necklace" },
  { name: "Pendents", img: PendentsImg, href: "/pendents" },
  { name: "Men Collection", img: MenCollectionImg, href: "/mencollections" },
];

const loopItems = [...items, ...items];

export default function JewelryAutoSlider() {
  const x = useMotionValue(0);
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current = animate(
      x,
      ["0%", "-50%"],
      {
        duration: 30,
        ease: "linear",
        repeat: Infinity,
      }
    );

    return () => animationRef.current?.stop();
  }, [x]);

  const pause = () => {
    animationRef.current?.pause();
  };

  const resume = () => {
    animationRef.current?.play();
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#FFF5F5] py-8 md:py-12">
      <motion.div
        className="flex gap-4 sm:gap-6 md:gap-8 w-max"
        style={{ x }}
      >
        {loopItems.map((item, index) => (
          <Link key={index} href={item.href} className="block">
            <motion.div
              onMouseEnter={pause}
              onMouseLeave={resume}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="
                relative
                w-[240px] h-[260px]
                sm:w-[280px] sm:h-[300px]
                md:w-[320px] md:h-[320px]
                overflow-hidden
                bg-white
                cursor-pointer
                will-change-transform
              "
            >
              <Image
                src={item.img}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 320px"
                className="object-cover"
                priority={index < 3}
                quality={100}
              />

              <span
                className="
                  absolute top-3 left-3 sm:top-4 sm:left-4
                  z-10
                  text-[10px] sm:text-xs
                  font-semibold uppercase tracking-wide
                  text-gray-800
                  bg-white backdrop-blur
                  px-2 py-1
                  rounded-xl
                "
              >
                {item.name}
              </span>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
