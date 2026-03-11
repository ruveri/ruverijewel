import Products from "../nopage/home/Products";

export const metadata = {
  title: "Gold, Silver & Diamond Bracelets for Women | Ruveri Jewel",
  description:
    "Explore elegant gold, silver, and diamond bracelets at Ruveri Jewel. Discover beautifully crafted luxury bracelets designed for modern style and timeless elegance. Worldwide shipping available.",
  keywords: [
    "gold bracelets",
    "diamond bracelets",
    "silver bracelets",
    "bracelets for women",
    "luxury bracelets",
    "designer bracelets",
    "buy bracelets online",
    "gold jewelry",
    "diamond jewelry",
    "silver jewelry",
    "Ruveri Jewel",
  ],

  logo1Graph: {
    title: "Luxury Gold, Silver & Diamond Bracelets | Ruveri Jewel",
    description:
      "Shop premium gold, silver, and diamond bracelets from Ruveri Jewel. Elegant designs crafted with precision and shipped worldwide.",
    url: "https://ruverijewel.com/bracelets",
    siteName: "Ruveri Jewel",
    images: [
      {
        url: "https://ruverijewel.com/logo1.png",
        width: 1200,
        height: 630,
        alt: "Luxury Bracelets Collection by Ruveri Jewel",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Designer Gold, Silver & Diamond Bracelets | Ruveri Jewel",
    description:
      "Discover the stunning bracelet collection at Ruveri Jewel. Shop elegant gold, silver, and diamond bracelets perfect for every occasion.",
    images: ["https://ruverijewel.com/logo1.png"],
  },

  alternates: {
    canonical: "https://ruverijewel.com/bracelets",
  },
};

export default function Home() {
  return (
    <>
      <Products
        category="bracelets"
        title="Bracelets"
      />
    </>
  );
}