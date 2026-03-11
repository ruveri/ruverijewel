import Products from "../nopage/home/Products";

export const metadata = {
  title: "Gold, Silver & Diamond Rings for Women | Ruveri Jewel",
  description:
    "Discover elegant gold, silver, and diamond rings at Ruveri Jewel. Explore beautifully crafted designer rings perfect for everyday wear, engagements, and special occasions. Worldwide shipping available.",
  keywords: [
    "gold rings",
    "diamond rings",
    "silver rings",
    "rings for women",
    "designer rings",
    "luxury rings",
    "buy rings online",
    "engagement rings",
    "gold jewelry",
    "diamond jewelry",
    "silver jewelry",
    "Ruveri Jewel"
  ],

  logo1Graph: {
    title: "Luxury Gold, Silver & Diamond Rings | Ruveri Jewel",
    description:
      "Shop stunning gold, silver, and diamond rings at Ruveri Jewel. Elegant ring designs crafted for timeless beauty and modern style.",
    url: "https://ruverijewel.com/rings",
    siteName: "Ruveri Jewel",
    images: [
      {
        url: "https://ruverijewel.com/logo1.png",
        width: 1200,
        height: 630,
        alt: "Luxury Rings Collection by Ruveri Jewel",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Designer Gold, Silver & Diamond Rings | Ruveri Jewel",
    description:
      "Explore the premium ring collection at Ruveri Jewel. Shop elegant gold, silver, and diamond rings crafted for every occasion.",
    images: ["https://ruverijewel.com/logo1.png"],
  },

  alternates: {
    canonical: "https://ruverijewel.com/rings",
  },
};

export default function Home() {
  return (
    <>
      <Products
        category="rings"
        title="Rings"
      />
    </>
  );
}