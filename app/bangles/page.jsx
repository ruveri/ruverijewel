import Products from "../nopage/home/Products";

export const metadata = {
  title: "Gold, Silver & Diamond Bangles for Women | Ruveri Jewel",
  description:
    "Shop elegant gold, silver, and diamond bangles at Ruveri Jewel. Discover handcrafted bangles designed for modern women. Luxury jewelry crafted with precision and shipped worldwide.",
  keywords: [
    "gold bangles",
    "diamond bangles",
    "silver bangles",
    "bangles for women",
    "luxury bangles",
    "designer bangles",
    "buy bangles online",
    "gold jewelry",
    "diamond jewelry",
    "silver jewelry",
    "Ruveri Jewel",
  ],

  logo1Graph: {
    title: "Luxury Gold, Silver & Diamond Bangles | Ruveri Jewel",
    description:
      "Discover stunning gold, silver, and diamond bangles at Ruveri Jewel. Elegant designs crafted for timeless beauty and global delivery.",
    url: "https://ruverijewel.com/bangles",
    siteName: "Ruveri Jewel",
    images: [
      {
        url: "https://ruverijewel.com/logo1.png",
        width: 1200,
        height: 630,
        alt: "Luxury Bangles Collection by Ruveri Jewel",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Designer Gold, Silver & Diamond Bangles | Ruveri Jewel",
    description:
      "Explore the luxury bangles collection by Ruveri Jewel. Shop elegant gold, silver, and diamond bangles crafted for every occasion.",
    images: ["https://ruverijewel.com/logo1.png"],
  },

  alternates: {
    canonical: "https://ruverijewel.com/bangles",
  },
};

export default function Home() {
  return (
    <>
      <Products category="bangles" title="Bangles" />
    </>
  );
}