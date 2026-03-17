
export default function ContactPage() {
  return (
    <main className="bg-[#0e0c0a] text-[#f0ebe3] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-body    { font-family: 'Jost', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerGold {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .fade-up { animation: fadeUp 0.9s ease both; }
        .d1 { animation-delay: 0.1s; }
        .d2 { animation-delay: 0.25s; }
        .d3 { animation-delay: 0.4s; }
        .d4 { animation-delay: 0.55s; }
        .d5 { animation-delay: 0.7s; }
        .d6 { animation-delay: 0.85s; }

        .gold-shimmer {
          background: linear-gradient(90deg, #c9a96e 0%, #f0d898 45%, #c9a96e 55%, #a07840 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerGold 4s linear infinite;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,110,0.35), transparent);
        }

        .contact-card {
          border: 1px solid rgba(201,169,110,0.15);
          transition: border-color 0.4s ease, background 0.4s ease, transform 0.4s cubic-bezier(0.23,1,0.32,1);
        }
        .contact-card:hover {
          border-color: rgba(201,169,110,0.45);
          background: rgba(201,169,110,0.04);
          transform: translateY(-4px);
        }

        .grain::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.022;
          pointer-events: none;
          z-index: 50;
        }
      `}</style>

      <div className="grain">
        {/* ── Background glow ── */}
        <div className="fixed inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(201,169,110,0.05) 0%, transparent 70%)" }} />

        <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
          <div className="w-full max-w-2xl mx-auto">

            {/* ── Top label ── */}
            <p className="fade-up d1 text-center text-[10px] tracking-[0.5em] text-[#c9a96e] uppercase mb-8"
              style={{ fontFamily: "'Jost', sans-serif" }}>
              Ruveri Jewel
            </p>

            {/* ── Heading ── */}
            <h1 className="fade-up d2 text-center text-5xl md:text-7xl font-light leading-none mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em" }}>
              Let's <em className="italic gold-shimmer">Talk.</em>
            </h1>

            {/* ── Subline ── */}
            <p className="fade-up d3 text-center text-[#8a7a6a] text-sm leading-relaxed mb-12"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.03em" }}>
              We'd love to hear from you — whether it's a bespoke enquiry,<br className="hidden sm:block" />
              an order question, or simply a hello.
            </p>

            <div className="divider fade-up d3 mb-12" />

            {/* ── Contact Cards ── */}
            <div className="fade-up d4 flex flex-col gap-4">

              {/* Email */}
              <a href="mailto:ruverijewel@gmail.com"
                className="contact-card flex items-center gap-6 px-8 py-6 rounded-2xl group">
                <div className="w-11 h-11 rounded-full border border-[#c9a96e]/25 flex items-center justify-center flex-shrink-0 group-hover:border-[#c9a96e]/60 transition-colors duration-400">
                  <svg className="w-4 h-4 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] tracking-[0.35em] text-[#c9a96e]/60 uppercase mb-1"
                    style={{ fontFamily: "'Jost', sans-serif" }}>Email Us</p>
                  <p className="text-[#f0ebe3] text-base truncate group-hover:text-[#c9a96e] transition-colors duration-300"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", letterSpacing: "0.01em" }}>
                    ruverijewel@gmail.com
                  </p>
                </div>
                <svg className="w-4 h-4 text-[#c9a96e]/30 group-hover:text-[#c9a96e] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              {/* Phone 1 */}
              <a href="tel:+916353974557"
                className="contact-card flex items-center gap-6 px-8 py-6 rounded-2xl group">
                <div className="w-11 h-11 rounded-full border border-[#c9a96e]/25 flex items-center justify-center flex-shrink-0 group-hover:border-[#c9a96e]/60 transition-colors duration-400">
                  <svg className="w-4 h-4 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[9px] tracking-[0.35em] text-[#c9a96e]/60 uppercase mb-1"
                    style={{ fontFamily: "'Jost', sans-serif" }}>Call Us</p>
                  <p className="text-[#f0ebe3] group-hover:text-[#c9a96e] transition-colors duration-300"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", letterSpacing: "0.04em" }}>
                    +91 63539 74557
                  </p>
                </div>
                <svg className="w-4 h-4 text-[#c9a96e]/30 group-hover:text-[#c9a96e] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              {/* Phone 2 */}
              <a href="tel:+919265942343"
                className="contact-card flex items-center gap-6 px-8 py-6 rounded-2xl group">
                <div className="w-11 h-11 rounded-full border border-[#c9a96e]/25 flex items-center justify-center flex-shrink-0 group-hover:border-[#c9a96e]/60 transition-colors duration-400">
                  <svg className="w-4 h-4 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[9px] tracking-[0.35em] text-[#c9a96e]/60 uppercase mb-1"
                    style={{ fontFamily: "'Jost', sans-serif" }}>Call Us</p>
                  <p className="text-[#f0ebe3] group-hover:text-[#c9a96e] transition-colors duration-300"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", letterSpacing: "0.04em" }}>
                    +91 92659 42343
                  </p>
                </div>
                <svg className="w-4 h-4 text-[#c9a96e]/30 group-hover:text-[#c9a96e] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/916353974557" target="_blank" rel="noopener noreferrer"
                className="contact-card flex items-center gap-6 px-8 py-6 rounded-2xl group">
                <div className="w-11 h-11 rounded-full border border-[#c9a96e]/25 flex items-center justify-center flex-shrink-0 group-hover:border-[#c9a96e]/60 transition-colors duration-400">
                  <svg className="w-4 h-4 text-[#c9a96e]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[9px] tracking-[0.35em] text-[#c9a96e]/60 uppercase mb-1"
                    style={{ fontFamily: "'Jost', sans-serif" }}>WhatsApp</p>
                  <p className="text-[#f0ebe3] group-hover:text-[#c9a96e] transition-colors duration-300"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", letterSpacing: "0.04em" }}>
                    +91 63539 74557
                  </p>
                </div>
                <svg className="w-4 h-4 text-[#c9a96e]/30 group-hover:text-[#c9a96e] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* ── Divider + note ── */}
            <div className="divider fade-up d5 mt-12 mb-8" />

            <p className="fade-up d6 text-center text-[#4a3f35] text-xs leading-relaxed"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.04em" }}>
              We typically respond within 1–2 business days.<br />
              For urgent queries, please call or WhatsApp us directly.
            </p>

            {/* ── Bottom wordmark ── */}
            <p className="fade-up d6 text-center mt-10 text-2xl font-light text-[#c9a96e]/20"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.1em" }}>
              RUVERI JEWEL
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}