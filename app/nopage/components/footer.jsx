import Image from "next/image";
import {
  Instagram,
  Youtube,
  Twitter,
  Facebook,
} from "lucide-react";

export default function LuxuryFooter() {
  return (
    <section className="relative w-full h-[90vh] md:h-[50vh] ci">
      {/* Background Image */}
      <Image
        src="/footer.webp"
        alt="Luxury Jewelry"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 py-12 flex flex-col justify-end">
        <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-12">

          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                Instagram,
                Youtube,
                Twitter,
                Facebook,
              ].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-black  transition cursor-pointer"
                >
                  <Icon size={18} />
                </div>
              ))}
            </div>

            {/* Logo Image */}
            <div className="pt-2">
              <Image
                src="/logo.webp" // your logo
                alt="Brand Logo"
                width={500}
                height={60}
                className="object-contain"
              />
            </div>
          </div>

          {/* RIGHT SIDE LINKS (Fully Right Aligned) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-black md:justify-self-end text-left">
            <div>
              <h4 className="mb-4 uppercase tracking-widest text-md opacity-80">
                Customer Care
              </h4>
              <ul className="space-y-3 text-sm opacity-90">
                <li className="hover:opacity-70 cursor-pointer">
                  Book an Appointment
                </li>
                <li className="hover:opacity-70 cursor-pointer">
                  Contact Us
                </li>
                <li className="hover:opacity-70 cursor-pointer">
                  FAQ
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 uppercase tracking-widest text-md opacity-80">
                Information
              </h4>
              <ul className="space-y-3 text-sm opacity-90">
                <li className="hover:opacity-70 cursor-pointer">
                  Certificates
                </li>
                <li className="hover:opacity-70 cursor-pointer">
                  Privacy Policy
                </li>
                <li className="hover:opacity-70 cursor-pointer">
                  Terms & Conditions
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
