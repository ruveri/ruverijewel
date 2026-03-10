import Products from "../nopage/home/Products";

export const metadata = {
  title: "Couple Name Keychains – Personalized Keychains for Couples | Erroneous Gold",
  description:
    "Shop custom Couple Name Keychains at Erroneous Gold. Create personalized keychains with both names — a thoughtful symbol of love and togetherness, perfect for gifting.",
  keywords: [
    "couple name keychain",
    "personalized keychain",
    "custom name keychain",
    "keychain for couples",
    "engraved keychain",
    "relationship gift",
    "custom couple gift",
    "personalized accessories",
    "erroneous gold",
  ],
  openGraph: {
    title: "Custom Couple Name Keychains | Erroneous Gold",
    description:
      "Design your personalized Couple Name Keychain with Erroneous Gold. A meaningful accessory that celebrates connection and love.",
    url: "https://erroneousgold.com/ckeychain",
    siteName: "Erroneous Gold",
    images: [
      {
        url: "https://erroneousgold.com/open.png",
        width: 1200,
        height: 630,
        alt: "Couple Name Keychain – Personalized Gift by Erroneous Gold",
      },
    ],
    locale: "en_IN",
    
  },
  twitter: {
    card: "summary_large_image",
    title: "Personalized Couple Name Keychains | Erroneous Gold",
    description:
      "Create a custom Couple Name Keychain — the perfect personalized gift for your partner, handcrafted with care by Erroneous Gold.",
    images: ["https://erroneousgold.com/open.png"],
  },
  alternates: {
    canonical: "https://erroneousgold.com/ckeychain",
  },
};

export default function Home() {
  return (
    <>
      <Products category="chains" title="Chains" />
    </>
  );
}
