"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function JewelryEditorialText() {
  return (
    <section className="hidden md:flex relative bg-back py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center space-y-6">
        
        {/* LINE 1 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="ci text-[26px] sm:text-[30px] md:text-[34px] tracking-wide text-black"
        >
          Jewelry is more than just an accessory, it’s an
        </motion.p>

        {/* LINE 2 (image in center) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-6"
        >
          <span className="ci text-[26px] sm:text-[30px] md:text-[34px] tracking-wide">
            expression and
          </span>

          <div className="relative w-[140px] h-[52px] rounded-full overflow-hidden">
            <Image
              src="/jewelry/ring1.jpg"
              alt="Jewelry detail"
              fill
              className="object-cover"
            />
          </div>

          <span className="ci text-[26px] sm:text-[30px] md:text-[34px] tracking-wide">
            timeless beauty
          </span>
        </motion.div>

        {/* LINE 3 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="ci text-[26px] sm:text-[30px] md:text-[34px] tracking-wide"
        >
          That’s the reason why each piece in our collection
        </motion.p>
         {/* LINE 4 */}
         <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="ci text-[26px] sm:text-[30px] md:text-[34px] tracking-wide"
        >
          is thoughtfully curated and expertly crafted using
        </motion.p>

        {/* LINE 5 (image left & right) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-6"
        >
          <div className="relative w-[140px] h-[52px] rounded-full overflow-hidden">
            <Image
              src="/jewelry/ring2.jpg"
              alt="Jewelry detail"
              fill
              className="object-cover"
            />
          </div>

          <span className="ci text-[26px] sm:text-[30px] md:text-[34px] tracking-wide">
            the highest quality materials
          </span>

          <div className="relative w-[140px] h-[52px] rounded-full overflow-hidden">
            <Image
              src="/jewelry/ring3.jpg"
              alt="Jewelry detail"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

      
        

      </div>
    </section>
  );
}
