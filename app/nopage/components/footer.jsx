import Image from "next/image";
import Link from "next/link";
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

              <Link
                href="https://www.instagram.com/ruveri_jewel?igsh=MTUyYms5aWR0aTVleg%3D%3D&utm_source=qr"
                target="_blank"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-black transition"
              >
                <Instagram size={18} />
              </Link>

            

              <Link
                href="https://www.facebook.com/profile.php?id=61573927306902&rdid=mRhsyzyKydqGunQk&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Y5FLCUFcq%2F%3Fref%3D1#"
                target="_blank"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-black transition"
              >
                <Facebook size={18} />
              </Link>

            </div>

            {/* Logo Image (Clickable to Home) */}
            <div className="pt-2">
              <Link href="/">
                <Image
                  src="/logo.webp"
                  alt="Brand Logo"
                  width={500}
                  height={60}
                  className="object-contain"
                />
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE LINKS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-black md:justify-self-end text-left">

            {/* Customer Care */}
            <div>
              <h4 className="mb-4 uppercase tracking-widest text-md opacity-80">
                Customer Care
              </h4>

              <ul className="space-y-3 text-sm opacity-90">

                <li>
                  <Link href="/my-orders" className="hover:opacity-70">
                    My Order
                  </Link>
                </li>
                <li>
                  <Link href="/certificates" className="hover:opacity-70">
                    Certificates
                  </Link>
                </li>

                 <li>
                  <Link href="/contact-us" className="hover:opacity-70">
                    Contact us
                  </Link>
                </li>

                <li>
                  <Link href="/about-us" className="hover:opacity-70">
                   About Ruveri Jewel
                  </Link>
                </li>



              </ul>
            </div>

            {/* Information */}
            <div>
              <h4 className="mb-4 uppercase tracking-widest text-md opacity-80">
                Information
              </h4>

              <ul className="space-y-3 text-sm opacity-90">

                <li>
                  <Link href="/exchange-policy" className="hover:opacity-70">
                    Exchange Policy
                  </Link>
                </li>

                <li>
                  <Link href="/privacy-policy" className="hover:opacity-70">
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link href="/terms-and-conditions" className="hover:opacity-70">
                    Terms & Conditions
                  </Link>
                </li>

              </ul>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}