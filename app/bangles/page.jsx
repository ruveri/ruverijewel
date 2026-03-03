import Products from "../nopage/home/Products";

export const metadata = {
  title: "Personalized Name Rakhis – Custom Rakhis for Raksha Bandhan | Erroneous Gold",
  description:
    "Celebrate Raksha Bandhan with personalized Name Rakhis from Erroneous Gold. Customize your Rakhi with names or initials — a thoughtful and memorable gift for your sibling.",
  keywords: [
    "personalized rakhi",
    "custom name rakhi",
    "raksha bandhan gifts",
    "name rakhi",
    "custom rakhi india",
    "gift rakhi",
    "handcrafted rakhi",
    "personalized gifts",
    "Erroneous Gold",
  ],
  openGraph: {
    title: "Personalized Name Rakhis | Erroneous Gold",
    description:
      "Shop custom Name Rakhis from Erroneous Gold. Personalized Rakhis handcrafted with care — perfect for gifting your sibling this Raksha Bandhan.",
    url: "https://erroneousgold.com/rakhi",
    siteName: "Erroneous Gold",
    images: [
      {
        url: "https://erroneousgold.com/open.png",
        width: 1200,
        height: 630,
        alt: "Personalized Name Rakhi by Erroneous Gold",
      },
    ],
    locale: "en_IN",
    
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Name Rakhis – Personalized Rakhi Collection | Erroneous Gold",
    description:
      "Create your personalized Name Rakhi — a meaningful and unique gift for your sibling this Raksha Bandhan. Handcrafted by Erroneous Gold.",
    images: ["https://erroneousgold.com/open.png"],
  },
  alternates: {
    canonical: "https://erroneousgold.com/rakhi",
  },
};

export default function Home() {
  return (
    <>
      <Products category="bangles" title="Bangles" />
    </>
  );
}
