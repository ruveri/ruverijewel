import Link from "next/link";

export const metadata = {
  title: "Ruveri — Your Personal Jeweller",
  description:
    "Ruveri is a personal jeweller that transforms individual stories into timeless jewellery pieces. Every design is carefully crafted to reflect the personality, style, and emotions of the wearer.",
};

export default function AboutPage() {
  return (
    <main className="bg-[#0e0c0a] text-[#f0ebe3] min-h-screen overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-body    { font-family: 'Jost', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmerGold {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .animate-fade-up { animation: fadeUp 1s ease both; }
        .animate-fade-in { animation: fadeIn 1.2s ease both; }
        .delay-1 { animation-delay: 0.15s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.5s; }
        .delay-4 { animation-delay: 0.7s; }
        .delay-5 { animation-delay: 0.9s; }

        .gold-shimmer {
          background: linear-gradient(90deg, #c9a96e 0%, #f0d898 40%, #c9a96e 60%, #a07840 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerGold 4s linear infinite;
        }

        .grain-overlay::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 100;
        }

        .photo-box {
          background: linear-gradient(135deg, #1a1714 0%, #2a2420 50%, #1a1714 100%);
          position: relative;
          overflow: hidden;
        }
        .photo-box::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(201,169,110,0.06) 100%);
          pointer-events: none;
        }
        .photo-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .photo-label {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.3);
        }

        .hover-lift {
          transition: transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s ease;
        }
        .hover-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px rgba(0,0,0,0.5);
        }

        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent);
        }

        .pillar-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: rgba(201,169,110,0.1);
        }
        @media (min-width: 768px) {
          .pillar-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div className="grain-overlay">

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(201,169,110,0.07) 0%, transparent 70%)" }} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full border border-[#c9a96e]/5" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[850px] h-[850px] rounded-full border border-[#c9a96e]/[0.03]" />
          </div>

          <div className="relative max-w-4xl mx-auto">
            <p className="font-body text-[10px] tracking-[0.5em] text-[#c9a96e] uppercase mb-10 animate-fade-up"
              style={{ fontFamily: "'Jost', sans-serif" }}>
              Est. Ruveri Jewel
            </p>
            <h1 className="font-display text-6xl md:text-8xl lg:text-[106px] font-light leading-none mb-6 animate-fade-up delay-1"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em" }}>
              <span className="block text-[#f0ebe3]">Your</span>
              <span className="block italic gold-shimmer">Personal</span>
              <span className="block text-[#f0ebe3]">Jeweller.</span>
            </h1>
            <div className="divider-line w-24 mx-auto my-10 animate-fade-in delay-2" />
            <p className="animate-fade-up delay-3 text-lg md:text-xl text-[#b8a898] max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.02em" }}>
              Ruveri transforms individual stories into timeless jewellery pieces.
              Every design crafted to reflect the personality, style, and emotions of the wearer.
            </p>
            <div className="mt-14 animate-fade-up delay-4">
              <Link href="/"
                className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] border border-[#c9a96e]/40 px-10 py-4 hover:bg-[#c9a96e] hover:text-[#0e0c0a] transition-all duration-500 inline-block"
                style={{ fontFamily: "'Jost', sans-serif" }}>
                Explore Collections
              </Link>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-5">
            <p className="text-[9px] tracking-[0.4em] text-[#c9a96e]/50 uppercase"
              style={{ fontFamily: "'Jost', sans-serif" }}>Scroll</p>
            <div className="w-px h-12 bg-gradient-to-b from-[#c9a96e]/30 to-transparent" />
          </div>
        </section>

        {/* ── BRAND STORY ── */}
        <section className="relative py-28 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-0 items-center">
            <div className="relative">
              <div className="photo-box w-full hover-lift" style={{ height: "600px" }}>
                {/* Replace with your actual photo path */}
                <img src="/jewelry/h1.jpg" alt="Ruveri jewellery craftsmanship" />
                <div className="photo-label">Your Photo Here</div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[#c9a96e]/20 pointer-events-none" />
            </div>

            <div className="lg:pl-20 pt-12 lg:pt-0">
              <p className="text-[10px] tracking-[0.4em] text-[#c9a96e] uppercase mb-8"
                style={{ fontFamily: "'Jost', sans-serif" }}>Our Story</p>
              <h2 className="text-5xl md:text-6xl font-light text-[#f0ebe3] leading-tight mb-10"
                style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em" }}>
                More than a brand —<br />
                <em className="italic text-[#c9a96e]">your jeweller.</em>
              </h2>
              <div className="divider-line w-16 mb-10" />
              <p className="text-[#b8a898] text-base leading-[2] mb-8"
                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
                Ruveri Jewellery is more than a brand — it is your personal jeweller.
                We believe jewellery should be as unique as the person wearing it.
              </p>
              <p className="text-[#b8a898] text-base leading-[2] mb-8"
                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
                From concept to creation, every piece is designed with meticulous
                attention to detail, combining fine craftsmanship with personal expression.
                We don&apos;t just make jewellery — we create wearable stories.
              </p>
              <p className="text-[#b8a898] text-base leading-[2]"
                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
                Each creation is thoughtfully designed to celebrate personal milestones,
                turning precious metals and diamonds into meaningful works of art that
                endure across generations.
              </p>
            </div>
          </div>
        </section>

        {/* ── TAGLINE BREAK ── */}
        <section className="py-28 px-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(201,169,110,0.04) 0%, transparent 70%)" }} />
          <div className="divider-line max-w-3xl mx-auto mb-20" />
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[10px] tracking-[0.5em] text-[#c9a96e] uppercase mb-8"
              style={{ fontFamily: "'Jost', sans-serif" }}>Our Promise</p>
            <blockquote className="text-4xl md:text-5xl lg:text-6xl font-light text-[#f0ebe3] leading-tight italic"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em" }}>
              &quot;Ruveri — Your Personal Jeweller<br />
              <em className="gold-shimmer">for Timeless Elegance.&quot;</em>
            </blockquote>
          </div>
          <div className="divider-line max-w-3xl mx-auto mt-20" />
        </section>

        {/* ── PHOTO GRID ── */}
        {/* <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] tracking-[0.4em] text-[#c9a96e] uppercase mb-12 text-center"
              style={{ fontFamily: "'Jost', sans-serif" }}>The Collection</p>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-5">
                <div className="photo-box w-full hover-lift" style={{ height: "560px" }}>
                  <img src="/about-photo-2.jpg" alt="Ruveri collection" />
                  <div className="photo-label">Photo 2</div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-7 flex flex-col gap-4">
                <div className="photo-box w-full hover-lift" style={{ height: "270px" }}>
                  <img src="/about-photo-3.jpg" alt="Ruveri bespoke jewellery" />
                  <div className="photo-label">Photo 3</div>
                </div>
                <div className="photo-box w-full hover-lift" style={{ height: "270px" }}>
                  <img src="/about-photo-4.jpg" alt="Ruveri detail" />
                  <div className="photo-label">Photo 4</div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* ── PHILOSOPHY PILLARS ── */}
        <section className="py-28 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-[10px] tracking-[0.4em] text-[#c9a96e] uppercase mb-6"
                style={{ fontFamily: "'Jost', sans-serif" }}>Our Philosophy</p>
              <h2 className="text-4xl md:text-5xl font-light text-[#f0ebe3]"
                style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em" }}>
                Craft. Story. <em className="italic text-[#c9a96e]">Identity.</em>
              </h2>
            </div>
            <div className="pillar-grid">
              {[
                {
                  number: "01",
                  title: "Bespoke Craft",
                  body: "Every Ruveri piece begins with a conversation. We listen to your story, understand your aesthetic, and translate that into a design that is unmistakably yours.",
                },
                {
                  number: "02",
                  title: "Personal Expression",
                  body: "We believe jewellery is a language. Through choice of metal, stone, and form, each piece speaks of who you are — your milestones, your memories, your identity.",
                },
                {
                  number: "03",
                  title: "Timeless Quality",
                  body: "Ruveri jewellery is crafted to last lifetimes. We source the finest precious metals and diamonds, worked by artisans who treat each piece as their masterwork.",
                },
              ].map((pillar) => (
                <div key={pillar.number}
                  className="bg-[#0e0c0a] p-10 md:p-12 group hover:bg-[#16130f] transition-colors duration-500">
                  <p className="text-5xl font-light text-[#c9a96e]/20 mb-8 group-hover:text-[#c9a96e]/40 transition-colors duration-500"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {pillar.number}
                  </p>
                  <div className="divider-line w-10 mb-8" />
                  <h3 className="text-2xl font-light text-[#f0ebe3] mb-6"
                    style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.01em" }}>
                    {pillar.title}
                  </h3>
                  <p className="text-[#8a7a6a] text-sm leading-[2]"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MISSION & VISION ── */}
        <section className="py-28 px-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(201,169,110,0.04) 0%, transparent 70%)" }} />
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] tracking-[0.4em] text-[#c9a96e] uppercase mb-8"
                style={{ fontFamily: "'Jost', sans-serif" }}>Mission</p>
              <h2 className="text-4xl md:text-5xl font-light text-[#f0ebe3] leading-tight mb-10"
                style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em" }}>
                To be the jeweller<br />
                <em className="italic text-[#c9a96e]">behind your story.</em>
              </h2>
              <div className="divider-line w-12 mb-10" />
              <p className="text-[#8a7a6a] text-base leading-[2]"
                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
                Our mission is to create bespoke jewellery that goes beyond ornamentation —
                pieces that carry the weight of your experiences, the joy of your milestones,
                and the depth of your emotions. We exist to be your permanent personal jeweller,
                a creative partner for every chapter of your life.
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.4em] text-[#c9a96e] uppercase mb-8"
                style={{ fontFamily: "'Jost', sans-serif" }}>Vision</p>
              <h2 className="text-4xl md:text-5xl font-light text-[#f0ebe3] leading-tight mb-10"
                style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em" }}>
                Jewellery as<br />
                <em className="italic text-[#c9a96e]">wearable memoir.</em>
              </h2>
              <div className="divider-line w-12 mb-10" />
              <p className="text-[#8a7a6a] text-base leading-[2]"
                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
                We envision a world where every person has a jeweller who truly knows them —
                one who can translate personality, lifestyle, and emotion into fine jewellery
                that feels like it was always meant to exist. Ruveri is that jeweller.
              </p>
            </div>
          </div>
        </section>

        {/* ── PORTFOLIO QUOTE ── */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="divider-line mb-16" />
            <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-center">
              <div>
                <p className="text-[10px] tracking-[0.4em] text-[#c9a96e] uppercase mb-4"
                  style={{ fontFamily: "'Jost', sans-serif" }}>In Our Own Words</p>
                <p className="text-2xl font-light text-[#f0ebe3]/30"
                  style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.02em" }}>
                  — Ruveri
                </p>
              </div>
              <blockquote className="text-2xl md:text-3xl font-light text-[#f0ebe3] leading-relaxed italic"
                style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.01em" }}>
                &quot;Ruveri represents the idea of a personal jeweller — creating bespoke designs
                that reflect the client&apos;s personality, lifestyle, and emotions through fine craftsmanship.&quot;
              </blockquote>
            </div>
            <div className="divider-line mt-16" />
          </div>
        </section>

        {/* ── WIDE PHOTO ── */}
        <section className="py-4 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="photo-box w-full hover-lift relative" style={{ height: "480px" }}>
              <img src="/about.JPG" alt="Ruveri jewellery lifestyle" />
              <div className="photo-label">Your Wide Photo Here</div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e0c0a]/70 via-transparent to-transparent flex items-end p-10 md:p-16" style={{ zIndex: 2 }}>
                <div>
                  <p className="text-[9px] tracking-[0.4em] text-[#c9a96e] uppercase mb-3"
                    style={{ fontFamily: "'Jost', sans-serif" }}>Fine Jewellery</p>
                  <p className="text-3xl md:text-5xl font-light text-white"
                    style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em" }}>
                    Crafted for you.<br />
                    <em className="italic text-[#c9a96e]">Always.</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-32 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)" }} />
          <div className="relative max-w-2xl mx-auto">
            <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#c9a96e]/30 mx-auto mb-12" />
            <p className="text-[10px] tracking-[0.5em] text-[#c9a96e] uppercase mb-8"
              style={{ fontFamily: "'Jost', sans-serif" }}>Begin Your Journey</p>
            <h2 className="text-5xl md:text-6xl font-light text-[#f0ebe3] leading-tight mb-12"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em" }}>
              Every great piece<br />
              <em className="italic gold-shimmer">starts with your story.</em>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/"
                className="text-xs tracking-[0.3em] uppercase bg-[#c9a96e] text-[#0e0c0a] px-10 py-4 hover:bg-[#f0d898] transition-colors duration-500 inline-block"
                style={{ fontFamily: "'Jost', sans-serif" }}>
                Shop Collection
              </Link>
            <Link href="/contact-us"
                className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] border border-[#c9a96e]/40 px-10 py-4 hover:border-[#c9a96e] transition-colors duration-500 inline-block"
                style={{ fontFamily: "'Jost', sans-serif" }}>
                Contact Us
              </Link>
            </div>
            <div className="w-px h-16 bg-gradient-to-t from-transparent to-[#c9a96e]/30 mx-auto mt-12" />
          </div>
        </section>


      </div>
    </main>
  );
}