import Products from "../nopage/home/Products";

export const metadata = {
  title: "Men’s Gold, Silver & Diamond Jewelry | Ruveri Jewel",
  description:
    "Explore the premium men’s jewelry collection at Ruveri Jewel. Discover stylish gold, silver, and diamond rings, chains, and bracelets crafted for modern men. Luxury designs with worldwide shipping.",
  keywords: [
    "mens jewelry",
    "mens gold jewelry",
    "mens silver jewelry",
    "mens diamond jewelry",
    "mens rings",
    "mens chains",
    "mens bracelets",
    "luxury mens jewelry",
    "designer mens jewelry",
    "Ruveri Jewel"
  ],

  openGraph: {
    title: "Luxury Men’s Jewelry Collection | Ruveri Jewel",
    description:
      "Shop elegant men’s gold, silver, and diamond jewelry from Ruveri Jewel. Discover premium rings, chains, and bracelets designed for modern style.",
    url: "https://ruverijewel.com/mens-collection",
    siteName: "Ruveri Jewel",
    images: [
      {
        url: "https://ruverijewel.com/open.png",
        width: 1200,
        height: 630,
        alt: "Men’s Jewelry Collection by Ruveri Jewel",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Designer Men’s Gold, Silver & Diamond Jewelry | Ruveri Jewel",
    description:
      "Discover stylish jewelry for men at Ruveri Jewel. Shop premium rings, chains, and bracelets crafted with precision and luxury.",
    images: ["https://ruverijewel.com/open.png"],
  },

  alternates: {
    canonical: "https://ruverijewel.com/mens-collection",
  },
};

export default function Home() {
  return (
    <>
      <Products category="mencollections" title="Men Collections" />
    </>
  );
}