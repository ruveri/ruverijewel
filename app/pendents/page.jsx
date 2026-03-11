import Products from "../nopage/home/Products";

export const metadata = {
  title: "Gold, Silver & Diamond Pendants for Women | Ruveri Jewel",
  description:
    "Shop elegant gold, silver, and diamond pendants at Ruveri Jewel. Discover stylish designer pendants crafted with precision to add timeless elegance to your jewelry collection. Worldwide shipping available.",
  keywords: [
    "gold pendants",
    "diamond pendants",
    "silver pendants",
    "pendants for women",
    "designer pendants",
    "luxury pendants",
    "buy pendants online",
    "gold jewelry",
    "diamond jewelry",
    "silver jewelry",
    "Ruveri Jewel"
  ],

  logo1Graph: {
    title: "Luxury Gold, Silver & Diamond Pendants | Ruveri Jewel",
    description:
      "Explore the premium pendant collection at Ruveri Jewel. Beautifully crafted gold, silver, and diamond pendants designed for everyday elegance and special occasions.",
    url: "https://ruverijewel.com/pendants",
    siteName: "Ruveri Jewel",
    images: [
      {
        url: "https://ruverijewel.com/logo1.png",
        width: 1200,
        height: 630,
        alt: "Luxury Pendant Collection by Ruveri Jewel",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Designer Gold, Silver & Diamond Pendants | Ruveri Jewel",
    description:
      "Discover elegant pendant designs at Ruveri Jewel. Shop stunning gold, silver, and diamond pendants crafted for modern style and timeless beauty.",
    images: ["https://ruverijewel.com/logo1.png"],
  },

  alternates: {
    canonical: "https://ruverijewel.com/pendants",
  },
};

export default function Home() {
  return (
    <>
      <Products
        category="pendants"
        title="Pendants"
      />
    </>
  );
}