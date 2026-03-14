import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions — Ruveri Jewel",
  description: "Terms and Conditions for Ruveri Jewel. Please read these terms carefully before using our website or services.",
};

const sections = [
  {
    number: "01",
    title: "Use of Website",
    content: `By accessing www.ruverijewel.com ("Platform"), you warrant and represent to Ruveri Jewel that you are legally entitled to do so and to make use of the information made available via the Platform.

All content, features, and services available on this Platform are subject to these Terms and Conditions. Please read them carefully before proceeding to use our services.`,
  },
  {
    number: "02",
    title: "Offer Details",
    content: `Current promotional offers are valid only on selected designs.

Discount values and the eligible designs are subject to change without prior notice.

Applicability of existing offers in conjunction with other vouchers or promotions is at the sole discretion of Ruveri Jewel.`,
  },
  {
    number: "03",
    title: "Trademarks",
    content: `The trademarks, names, logos, and service marks (collectively "trademarks") displayed on this Platform are registered and unregistered trademarks of Ruveri Jewel. Nothing contained on this Platform should be construed as granting any licence or right to use any trademark without the prior written permission of Ruveri Jewel.`,
  },
  {
    number: "04",
    title: "External Links",
    content: `External links may be provided for your convenience, but they are beyond the control of Ruveri Jewel and no representation is made as to their content.

Use or reliance on any external links and the content thereon is at your own risk. We encourage you to review the terms and privacy policies of any external sites you visit.`,
  },
  {
    number: "05",
    title: "Prices",
    content: `Our pricing is calculated using current precious metal and gemstone prices to give you the best possible value. These prices change from time to time owing to fluctuations in precious metal and gemstone markets, and our prices are updated accordingly.

Prices on www.ruverijewel.com are subject to change without notice. You will be charged the price listed for your selected item on the day of purchase.`,
  },
  {
    number: "06",
    title: "Warranties",
    content: `Ruveri Jewel makes no warranties, representations, statements, or guarantees (whether express, implied in law, or residual) regarding the Platform or its content.

While we strive to keep all information accurate and up to date, we do not warrant that the Platform will be free from errors or interruptions.`,
  },
  {
    number: "07",
    title: "Disclaimer of Liability",
    content: `Ruveri Jewel shall not be responsible for and disclaims all liability for any loss, liability, damage (whether direct, indirect, or consequential), personal injury, or expense of any nature whatsoever which may be suffered by you or any third party as a result of, or attributable to, your access and use of the Platform, any information contained on the Platform, or material and information transmitted over our system.

We as a merchant shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorisation for any transaction on account of the cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.`,
  },
  {
    number: "08",
    title: "Cancellation & Returns",
    content: `You may cancel your order for a product at no cost any time before we send the Dispatch Confirmation email relating to that product. You may cancel one order item within a multi-item order without cancelling the entire order.

For prepaid orders, the amount will be credited to the original payment source (Credit Card / Debit Card / Net Banking / UPI).

For cash on delivery orders, the refund will be processed to your bank account.

Returns are accepted within 7 days of delivery, subject to the product being in its original condition with all packaging and certificates intact. Custom and personalised orders are not eligible for return.

Please write to ruverijewel@gmail.com for assistance with cancellations or returns.`,
  },
  {
    number: "09",
    title: "Exchanges",
    content: `Ruveri Jewel offers a lifetime exchange policy on all jewellery purchases. You may exchange your jewellery at any time at our store or by contacting us at ruverijewel@gmail.com.

Exchange value will be calculated based on the current market rate for the metal and gemstone(s) at the time of exchange, subject to applicable deductions for making charges.

Custom and personalised orders are not eligible for exchange.`,
  },
  {
    number: "10",
    title: "Conflict of Terms",
    content: `If there is a conflict or contradiction between the provisions of these Terms and Conditions and any other relevant terms, policies, or notices, the other relevant terms and conditions, policies, or notices which relate specifically to a particular section or module of the Platform shall prevail in respect of your use of that section or module.`,
  },
  {
    number: "11",
    title: "Severability",
    content: `Any provision of any relevant terms and conditions, policies, or notices which is or becomes unenforceable in any jurisdiction — whether due to being void, invalid, illegal, unlawful, or for any other reason — shall, in such jurisdiction only and only to the extent that it is unenforceable, be treated as void.

The remaining provisions of any relevant terms and conditions, policies, and notices shall remain in full force and effect.`,
  },
  {
    number: "12",
    title: "Contests & Giveaways",
    content: `Winners of contests and giveaways will be selected at Ruveri Jewel's sole discretion.

Prizes, gifts, and giveaways are non-returnable and non-exchangeable.

Any additional facilities provided to contest winners or selectees are at the company's discretion.

Ruveri Jewel reserves the right to change the terms and conditions of contests or giveaways without prior notice.

All disputes will be resolved by writing to ruverijewel@gmail.com.`,
  },
  {
    number: "13",
    title: "Fair Use Policy",
    content: `At Ruveri Jewel, we aim to maintain a fair, safe, and enjoyable shopping experience for all customers. We prohibit certain types of misuse of our services, including:

• Excessively ordering or returning products beyond normal personal use
• Frequently cancelling or returning items on false grounds
• Using our services for commercial purposes or resale
• Engaging in fraud, including fake or altered returns
• Exploiting promotions, referral programmes, or limited-time offers
• Creating multiple or proxy accounts to extract extra benefits
• Behaving abusively or unethically towards our staff, delivery partners, or vendors

This policy does not prevent you from exercising your legal rights or using our return and exchange policies for genuine personal use.

We reserve the right to take appropriate action in cases of non-compliance, including issuing warnings, restricting features, refusing orders or returns, cancelling accounts, and in serious cases, pursuing legal action.`,
  },
  {
    number: "14",
    title: "PAN Card Requirement",
    content: `As per current guidelines mandated by the Government of India, a customer must provide their Permanent Account Number (PAN) for all purchases above INR 2,00,000 (Two Lakh Rupees).

Please ensure your PAN details are accurate and match your government-issued ID.`,
  },
  {
    number: "15",
    title: "Applicable Laws",
    content: `Use of this Platform shall in all respects be governed by the laws of India, regardless of the laws that might be applicable under principles of conflicts of law.

The parties agree that the courts located in India shall have exclusive jurisdiction over all controversies arising under this agreement.`,
  },
  {
    number: "16",
    title: "Amendments",
    content: `Ruveri Jewel reserves the right to amend, update, or modify these Terms and Conditions at any time without prior notice. Changes will be effective immediately upon posting on the Platform.

We encourage you to review these Terms and Conditions periodically to stay informed of any updates. Continued use of the Platform following the posting of changes constitutes your acceptance of such changes.`,
  },
  {
    number: "17",
    title: "Contact Us",
    content: `For any queries, disputes, or concerns relating to these Terms and Conditions or our services, please reach out to us at:

Email: ruverijewel@gmail.com
Website: www.ruverijewel.com

We are committed to addressing your concerns promptly and transparently.`,
  },
];

export default function TermsAndConditionsPage() {
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
            Terms &amp; Conditions
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

      {/* ── Intro Banner ── */}
      <section className="bg-[#f5f0e8] border-b border-[#e8dcc8]">
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <p
            className="text-[#5a4a3a] text-base md:text-lg leading-relaxed"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Please read these Terms and Conditions carefully before using our website or placing an order. By accessing Ruveri Jewel, you agree to be bound by the terms described below.
          </p>
        </div>
      </section>

      {/* ── Table of Contents ── */}
      <section className="max-w-4xl mx-auto px-6 py-12">
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
              {/* Section Header */}
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

              {/* Divider */}
              <div className="w-full h-px bg-[#f0e8d8] mb-5 group-hover:bg-[#c9a96e]/20 transition-colors duration-300" />

              {/* Content */}
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
            Have questions about our terms?
          </h2>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">
            We're happy to help. Write to us and we'll get back to you as soon as possible.
          </p>
          <a
            href="mailto:ruverijewel@gmail.com"
            className="ci inline-flex items-center gap-3 bg-red-700 text-white px-8 py-3.5 text-sm tracking-widest uppercase hover:bg-red-800 transition-colors duration-300 rounded-full"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            ruverijewel@gmail.com
          </a>
          <div className="mt-8 flex items-center justify-center gap-6 text-white/20 text-xs tracking-wide">
            <Link href="/privacy-policy" className="hover:text-white/50 transition-colors duration-200">
              Privacy Policy
            </Link>
            <span>·</span>
            <span>www.ruverijewel.com</span>
          </div>
        </div>
      </section>
    </main>
  );
}