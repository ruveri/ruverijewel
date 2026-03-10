import Products from "../nopage/home/Products";

export const metadata = {
  title: "Single Name Keychains – Personalized Name Keychains | Erroneous Gold",
  description:
    "Discover custom Single Name Keychains at Erroneous Gold. Personalize your keychain with your name or initials — a stylish accessory and perfect gift for any occasion.",
  keywords: [
    "single name keychain",
    "personalized keychain",
    "custom name keychain",
    "engraved keychain",
    "name keychain gift",
    "personalized accessories",
    "custom keychain india",
    "name keychain design",
    "erroneous gold",
  ],
  openGraph: {
    title: "Custom Single Name Keychains | Erroneous Gold",
    description:
      "Shop personalized Single Name Keychains from Erroneous Gold. Add your name or initials to create a meaningful, stylish everyday accessory.",
    url: "https://erroneousgold.com/skeychain",
    siteName: "Erroneous Gold",
    images: [
      {
        url: "https://erroneousgold.com/open.png",
        width: 1200,
        height: 630,
        alt: "Single Name Keychain – Personalized Gift by Erroneous Gold",
      },
    ],
    locale: "en_IN",
    
  },
  twitter: {
    card: "summary_large_image",
    title: "Personalized Single Name Keychains | Erroneous Gold",
    description:
      "Create your custom Single Name Keychain — a personalized accessory that adds meaning to your everyday essentials.",
    images: ["https://erroneousgold.com/open.png"],
  },
  alternates: {
    canonical: "https://erroneousgold.com/skeychain",
  },
};

export default function Home() {
  return (
    <>
      <Products category="mencollections" title="Men Collections" />
    </>
  );
}
