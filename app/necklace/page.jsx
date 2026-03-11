import Products from "../nopage/home/Products";

export const metadata = {
  title: "Gold, Silver & Diamond Necklaces for Women | Ruveri Jewel",
  description:
    "Explore elegant gold, silver, and diamond necklaces at Ruveri Jewel. Discover beautifully crafted luxury necklaces designed for modern women and timeless style. Worldwide shipping available.",
  keywords: [
    "gold necklaces",
    "diamond necklaces",
    "silver necklaces",
    "necklaces for women",
    "luxury necklaces",
    "designer necklaces",
    "buy necklaces online",
    "gold jewelry",
    "diamond jewelry",
    "silver jewelry",
    "Ruveri Jewel"
  ],

  logo1Graph: {
    title: "Luxury Gold, Silver & Diamond Necklaces | Ruveri Jewel",
    description:
      "Shop premium gold, silver, and diamond necklaces from Ruveri Jewel. Elegant jewelry crafted with precision for everyday style and special occasions.",
    url: "https://ruverijewel.com/necklaces",
    siteName: "Ruveri Jewel",
    images: [
      {
        url: "https://ruverijewel.com/logo1.png",
        width: 1200,
        height: 630,
        alt: "Luxury Necklace Collection by Ruveri Jewel",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Designer Gold, Silver & Diamond Necklaces | Ruveri Jewel",
    description:
      "Discover elegant necklaces at Ruveri Jewel. Shop stunning gold, silver, and diamond necklace designs crafted for timeless beauty.",
    images: ["https://ruverijewel.com/logo1.png"],
  },

  alternates: {
    canonical: "https://ruverijewel.com/necklaces",
  },
};

export default function Home() {
  return (
    <>
      <Products category="necklace" title="Necklace" />
    </>
  );
}