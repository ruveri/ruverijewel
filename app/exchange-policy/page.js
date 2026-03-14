import Link from "next/link";

export const metadata = {
  title: "Exchange Policy — Ruveri Jewel",
  description:
"Exchange Policy for Ruveri Jewel. Learn about our 7-day exchange policy, unboxing video requirements, and exchange terms.",
};

const sections = [
  {
    number: "01",
    title: "7-Day Exchange Policy",
    content: `Ruveri Jewel offers a 7-day exchange policy on all jewellery purchases made through our website (www.ruverijewel.com) or our retail store.

You may raise an exchange request within 7 days of receiving your order. Requests raised after 7 days from the date of delivery will not be eligible under this policy.

To be eligible for exchange, the product must be:

• In its original, unworn condition
• Accompanied by all original packaging, tags, and certificates
• Supported by a valid unboxing video (see Section 02 below)

Custom, personalised, and made-to-order jewellery are not eligible for exchange under this policy.`,
  },
  {
    number: "02",
    title: "Unboxing Video Requirement",
    content: `An unboxing video is mandatory for all exchange requests. This is a firm requirement and no exchange will be processed without it.

The unboxing video must:

• Be recorded at the time of opening the package — before the package is fully unwrapped
• Show the sealed package clearly before opening
• Capture the entire unboxing process without any cuts, pauses, or edits
• Clearly show the product, all accessories, and the packaging in a single continuous take
• Be of sufficient quality to clearly identify the product and its condition upon arrival

Videos recorded after the package has been opened, or videos that are edited, trimmed, or unclear, will not be accepted.

Please keep your unboxing video ready before raising an exchange request. You will be required to upload it as part of the exchange process.

We recommend recording your unboxing video in good lighting so the product and packaging are clearly visible throughout.`,
  },
  {
    number: "03",
    title: "How to Raise an Exchange Request",
    content: `To initiate an exchange within the 7-day window:

1. Write to us at ruverijewel@gmail.com with the subject line "Exchange Request — Order #[your order number]"
2. Include your order number, the reason for exchange, and your unboxing video
3. Our team will review your request within 2–3 business days
4. Once approved, we will share instructions for shipping the product back to us
5. After we receive and inspect the product, your exchange will be processed

Please do not ship the product back to us before receiving approval from our team.`,
  },
  {
    number: "04",
    title: "Exchange Value Calculation",
    content: `The exchange value will be calculated based on the current market rate for the metal and gemstones on the day the exchange request is approved.

Category wise exchange values:

• Diamond & Gemstone Jewellery — 100% of gold/platinum value + 100% of diamond/gemstone value at current market rate
• Plain Gold / Plain Silver Jewellery — 100% of metal value at current market rate
• Silver Jewellery — 100% of silver value at current market rate

Making charges are non-refundable and will not be included in the exchange value calculation.

Any promotional discount or free gift received at the time of original purchase will be deducted from the exchange value. You may also choose to return the free gift received.`,
  },
  {
    number: "05",
    title: "Shipping for Exchange",
    content: `Ruveri Jewel provides free return shipping across India for all approved exchange requests within the 7-day policy window.

Once your exchange request is approved, we will arrange for a pickup from your delivery address. Please ensure the product is securely packed in its original packaging before handing it over.

For products above ₹35,000 in value, a tamper-proof packet will be sent to you before pickup. Please secure your jewellery inside, seal it, and hand it over to the pickup person. Once sealed, the packet cannot be opened without being destroyed.

Please collect an acknowledgement from the pickup person (pickup receipt, tracking number, or SMS confirmation) and retain it until your exchange is processed.`,
  },
  {
    number: "06",
    title: "Quality Inspection",
    content: `All returned products are subject to a thorough quality inspection at our end upon receipt.

The exchange value is subject to change based on the outcome of our quality inspection. If the product shows signs of damage, wear, alteration, or tampering beyond what was visible in the unboxing video, we reserve the right to revise or decline the exchange.

You will be notified of the inspection outcome within 2–3 business days of us receiving the product.

If you do not agree with the inspection result, you may choose to reject the exchange, in which case the product will be shipped back to you at no charge.`,
  },
  
  {
    number: "07",
    title: "Non-Eligible Items",
    content: `The following items are not eligible for exchange under any policy:

• Custom, personalised, and made-to-order jewellery
• Products that have been resized, altered, or repaired outside of Ruveri Jewel
• Products without the original certificate or packaging
• Products showing signs of misuse, damage, or tampering
• Exchange requests raised without a valid unboxing video (within the 7-day window)
• Exchange requests raised after 7 days from the date of delivery (not eligible under the 7-day policy, though lifetime exchange may still apply)`,
  },
  {
    number: "08",
    title: "Transit Insurance",
    content: `All orders shipped from Ruveri Jewel are fully insured until they reach you. Your purchase is 100% safe during transit.

In the rare event of loss or damage during delivery, please contact us immediately at ruverijewel@gmail.com with your order details and we will resolve the matter promptly.`,
  },
  {
    number: "9",
    title: "Contact Us",
    content: `For any exchange queries, requests, or concerns, please reach out to us at:

Email: ruverijewel@gmail.com
Website: www.ruverijewel.com

Our team is available to assist you and will respond within 1–2 business days. We are committed to making your experience with Ruveri Jewel as smooth and transparent as possible.`,
  },
];

export default function ExchangePolicyPage() {
  return (
    <main className="min-h-screen bg-back">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#1a1a1a] text-white px-6 py-24 md:py-36">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-white/5" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[900px] h-[900px] rounded-full border border-white/[0.03]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] text-[#c9a96e] uppercase mb-6 font-medium">
            Ruveri Jewel
          </p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-8"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Exchange Policy
          </h1>
          <div className="w-16 h-px bg-[#c9a96e] mx-auto mb-8" />
          <p className="text-white/50 text-sm tracking-wide">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </section>

      {/* ── Key Highlights Banner ── */}
      <section className="bg-[#f5f0e8] border-b border-[#e8dcc8]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <p
            className="text-center text-[#5a4a3a] text-base md:text-lg leading-relaxed mb-8"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            We want you to love every piece you receive. If something isn't right, we're here to make it right — fairly and transparently.
          </p>
          {/* 3 key highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                label: "7-Day Exchange",
                sub: "From date of delivery",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82V15a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                ),
                label: "Unboxing Video",
                sub: "Mandatory for all exchanges",
              },
             
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center bg-white border border-[#e0d5c5] rounded-xl px-5 py-6 gap-3"
              >
                <span className="text-[#c9a96e]">{item.icon}</span>
                <p className="font-medium text-[#1a1a1a] text-sm">{item.label}</p>
                <p className="text-[#8a7a6a] text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Important Notice ── */}
      <section className="max-w-4xl mx-auto px-6 pt-10 pb-2">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-5 flex gap-4 items-start">
          <span className="text-amber-500 text-xl flex-shrink-0 mt-0.5">⚠</span>
          <div>
            <p className="font-medium text-amber-900 text-sm mb-1">Unboxing Video is Mandatory</p>
            <p className="text-amber-800 text-sm leading-relaxed">
              No exchange will be processed without a valid unboxing video. Please record a continuous, unedited video of yourself opening your package before the product is fully unwrapped. Videos recorded after opening will not be accepted.
            </p>
          </div>
        </div>
      </section>

      {/* ── Table of Contents ── */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="border border-[#e0d5c5] rounded-2xl p-8 bg-white">
          <h2 className="text-xs tracking-[0.25em] text-[#c9a96e] uppercase font-medium mb-6">
            Contents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.number}
                href={`#section-${section.number}`}
                className="group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#faf6ef] transition-colors duration-200"
              >
                <span className="text-xs text-[#c9a96e] font-medium w-6 flex-shrink-0">
                  {section.number}
                </span>
                <span className="text-sm text-[#3a3a3a] group-hover:text-[#c9a96e] transition-colors duration-200">
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24 space-y-2">
        {sections.map((section) => (
          <div
            key={section.number}
            id={`section-${section.number}`}
            className="group bg-white border border-[#ebe3d5] rounded-2xl overflow-hidden hover:border-[#c9a96e]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a96e]/5"
          >
            <div className="px-8 py-7">
              <div className="flex items-start gap-5 mb-5">
                <span
                  className="text-4xl font-light text-[#e8dcc8] leading-none flex-shrink-0 select-none"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {section.number}
                </span>
                <h2
                  className="text-xl md:text-2xl font-medium text-[#1a1a1a] leading-tight pt-1"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {section.title}
                </h2>
              </div>
              <div className="w-full h-px bg-[#f0e8d8] mb-5 group-hover:bg-[#c9a96e]/20 transition-colors duration-300" />
              <div className="space-y-3">
                {section.content.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className="text-[#5a5a5a] text-sm md:text-base leading-relaxed"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Contact CTA ── */}
      <section className="bg-[#1a1a1a] text-white px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-10 h-px bg-[#c9a96e] mx-auto mb-8" />
          <h2
            className="text-2xl md:text-3xl font-light mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Need help with an exchange?
          </h2>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">
            Write to us with your order number and unboxing video and we'll take it from there.
          </p>
          <a
            href="mailto:ruverijewel@gmail.com"
            className="ci inline-flex items-center gap-3 bg-red-700 text-white px-8 py-3.5 text-sm tracking-widest uppercase hover:bg-red-800 transition-colors duration-300 rounded-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            ruverijewel@gmail.com
          </a>
          <div className="mt-8 flex items-center justify-center gap-6 text-white/20 text-xs tracking-wide">
            <Link href="/privacy-policy" className="hover:text-white/50 transition-colors duration-200">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms-and-conditions" className="hover:text-white/50 transition-colors duration-200">
              Terms &amp; Conditions
            </Link>
            <span>·</span>
            <span>www.ruverijewel.com</span>
          </div>
        </div>
      </section>
    </main>
  );
}