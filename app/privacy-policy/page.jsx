import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Ruveri Jewel",
  description: "Privacy Policy for Ruveri Jewel. Learn how we collect, use, and protect your personal information.",
};

const sections = [
  {
    number: "01",
    title: "Introduction",
    content: `Ruveri Jewel ("Ruveri Jewel", "we", "us" or "our") carries out our business through our retail store and our website (www.ruverijewel.com) (collectively "Platform"). At Ruveri Jewel, we respect your privacy and are committed to taking reasonable precautions to protect your information and comply with our obligations related to privacy.

This policy ("Privacy Policy") outlines the manner in which your information is collected by us through various interactions with you on the Platform, and how that information is used by us.

Please note that this Privacy Policy may be amended or updated from time to time to reflect changes in our practices or applicable law. We encourage you to read this Privacy Policy carefully and to regularly check it for any changes.

By accessing the services provided by the Platform, you agree to the collection, use, sharing, and storage of your information by Ruveri Jewel in the manner described in this Privacy Policy.`,
  },
  {
    number: "02",
    title: "Collection of Information",
    content: `We collect the details provided by you on registration (if any) together with information we learn about you from your use of our service and your visits to the Platform.

We may collect the following personally identifiable information:

• First and last name
• Email addresses
• Contact details including mobile phone numbers
• PIN/ZIP code
• Demographic profile (such as your age, gender, date of birth, and address)
• Your opinions on services, products, and features on our Platform

We also collect certain data as you access and use our services, including:

• Device information
• Domain server
• Location information
• IP address
• Type of web browser you are using
• Network carrier

We may also collect information about the pages you visit, links you click, number of times you access a page, and things you view, add to cart, or add to your wishlist.

If you make a purchase, we collect sensitive personal data in connection with the transaction. This includes your payment data such as credit or debit card details, bank/account details, and other account and authentication information, as well as billing, shipping, and contact details.`,
  },
  {
    number: "03",
    title: "Use of Information",
    content: `We use personal information to provide products and services on the Platform and for general business purposes. Specifically, we use your information to:

• Improve your shopping experience
• Send you order confirmations and updates
• Share special offers and personalised recommendations based on your browsing history and interests
• Notify you of changes in service policies or terms of use
• Send event-based communications such as renewal notices, invites, and reminders
• Troubleshoot problems and collect monies owed
• Measure interest in our products and services
• Inform you about online and offline offers
• Analyse demographic information to continually improve our product and service offerings
• Diagnose problems with our server and administer the Platform

All personal data collected by us is used only for the purposes specified in this Privacy Policy.`,
  },
  {
    number: "04",
    title: "Cookies and Similar Technologies",
    content: `We may use cookies and other technologies to provide, protect, and improve our products and services — such as by personalising content, offering and measuring advertisements, understanding user behaviour, and providing a safer experience.

You can remove or reject cookies using your browser or device settings, but in some cases doing so may affect your ability to use the Platform or our services.`,
  },
  {
    number: "05",
    title: "Disclosure of Personal Information",
    content: `We may share your personal information (on a need-to-know basis) with third parties that provide services on our behalf, such as website hosting, email services, marketing, order fulfilment, transaction processing, data analytics, customer service, and customer research.

These service providers are obligated to protect your data under applicable law.

We may also disclose personal information to certain third-party service providers so that we can personalise the Platform for you and perform behavioural analytics.

We reserve the right to disclose your personally identifiable information as required by law, or when we believe disclosure is necessary to protect our rights or comply with a judicial proceeding, legal process, or court order.

We do not sell, share, or distribute any personal information with third parties for their own marketing or advertising purposes without your prior express consent.`,
  },
  {
    number: "06",
    title: "Your Consent",
    content: `By using our Platform and/or by providing your information, you consent to the collection, sharing, storage, and use of the information you disclose on the Platform in accordance with this Privacy Policy, including your consent to sharing of your information as described herein.`,
  },
  {
    number: "07",
    title: "Links to Other Websites",
    content: `Our Platform may contain links to other websites. Please note that once you have used these links to leave our site, we do not have control over those websites. We are not responsible for the protection and privacy of any information you provide while visiting such sites. This Privacy Policy does not govern such sites. Please exercise caution and review the privacy policy of any website before sharing personal information.`,
  },
  {
    number: "08",
    title: "Your Rights",
    content: `You have the right to access or correct the personal information that we collect. You are also entitled to restrict or object, at any time, to the further processing of your personal information.

You may write to us at ruverijewel@gmail.com regarding the personal information collected by us.

If you believe that any information we hold about you is incorrect or incomplete, please write to us at the above email address and we will promptly correct it.

For any uses of your personal information described in this Privacy Policy that require your consent, you may withdraw your consent by writing to us. In the event you refuse to share any information or withdraw consent, we reserve the right to restrict or deny access to the Platform and our services for which we consider such information to be necessary.`,
  },
  {
    number: "09",
    title: "Data Retention",
    content: `We store and retain the personal data provided by users for as long as is required to fulfil the purposes for which such information is collected, as outlined in this Privacy Policy, subject to longer retention periods as may be required under applicable laws.`,
  },
  {
    number: "10",
    title: "Security Precautions",
    content: `Our Platform has security measures and standards in place (as required under applicable law) to protect against the loss, misuse, and alteration of information under our control. Whenever you access your registered account or process a transaction on our Platform, we offer the use of a secure server.

Please be aware that despite our best efforts, no security system is impenetrable.`,
  },
  {
    number: "11",
    title: "Choice / Opt-Out",
    content: `Our Platform provides all users with the opportunity to opt out of receiving non-essential (promotional, marketing-related) communications from us after setting up an account. You may also delete certain non-mandatory information.

You can write to us at ruverijewel@gmail.com to assist you with these requests.`,
  },
  {
    number: "12",
    title: "Profile Deactivation",
    content: `Our Platform enables you to temporarily freeze your profile. This temporary action will leave you without a Ruveri Jewel account and without access to features such as speedy checkout, past order information, wishlists, and all other personalised Ruveri Jewel products and services.`,
  },
  {
    number: "13",
    title: "Profile Deletion",
    content: `Our Platform enables you to request the permanent erasure of your Ruveri Jewel account. Once requested, all associated information — including past orders, wishlists, saved addresses, and any pending benefits — will no longer be accessible to you.

Profile deletion will require you to forfeit future account creation with the same email address, and any claims to policies like Lifetime Exchange & Buyback, 30 Day Returns and Refund, product cleaning & fixing, and any other policies or services offered by us.

In the event that your account has any open orders, payments, grievances, or shipments, we may refuse or delay the deletion of your account.`,
  },
  {
    number: "14",
    title: "Contact Us",
    content: `For any complaints, grievances, or queries relating to the processing of your personal data, please reach out to us at:

Email: ruverijewel@gmail.com
Website: www.ruverijewel.com

We are committed to addressing your concerns promptly and transparently.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-back">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#1a1a1a] text-white px-6 py-24 md:py-36">
        {/* Decorative background rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-white/5" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[900px] h-[900px] rounded-full border border-white/[0.03]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] text-red-800 uppercase mb-6 font-medium">
            Ruveri Jewel
          </p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-8"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Privacy Policy
          </h1>
          <div className="w-16 h-px bg-[#c9a96e] mx-auto mb-8" />
          <p className="text-white/50 text-sm tracking-wide">
            Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      {/* ── Intro Banner ── */}
      <section className="bg-[#f5f0e8] border-b border-[#e8dcc8]">
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <p className="text-[#5a4a3a] text-base md:text-lg leading-relaxed" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            At Ruveri Jewel, your trust means everything to us. This policy explains how we handle your personal information with care and transparency.
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
        {sections.map((section, index) => (
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
            Questions about your privacy?
          </h2>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">
            We're here to help. Reach out to us and we'll respond as soon as possible.
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
          <p className="mt-6 text-white/30 text-xs tracking-wide">
            www.ruverijewel.com
          </p>
        </div>
      </section>
    </main>
  );
}