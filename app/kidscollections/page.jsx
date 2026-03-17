import Products from "../nopage/home/Products";

export const metadata = {
  title: "Kids Gold, Silver & Diamond Jewelry | Ruveri Jewel",
  description:
    "Explore adorable kids’ jewelry at Ruveri Jewel. Discover beautifully crafted gold, silver, and diamond rings, bracelets, earrings, and pendants designed especially for children. Safe, elegant designs with worldwide shipping.",
  keywords: [
    "kids jewelry",
    "kids gold jewelry",
    "kids silver jewelry",
    "kids diamond jewelry",
    "kids rings",
    "kids bracelets",
    "kids earrings",
    "kids pendants",
    "children jewelry",
    "Ruveri Jewel"
  ],

  openGraph: {
    title: "Beautiful Kids Jewelry Collection | Ruveri Jewel",
    description:
      "Shop charming gold, silver, and diamond jewelry for kids at Ruveri Jewel. Explore rings, earrings, bracelets, and pendants designed with love and elegance.",
    url: "https://ruverijewel.com/kids-collection",
    siteName: "Ruveri Jewel",
    images: [
      {
        url: "https://ruverijewel.com/open.png",
        width: 1200,
        height: 630,
        alt: "Kids Jewelry Collection by Ruveri Jewel",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kids Gold, Silver & Diamond Jewelry | Ruveri Jewel",
    description:
      "Discover adorable jewelry for kids at Ruveri Jewel. Shop elegant rings, earrings, bracelets, and pendants crafted for children.",
    images: ["https://ruverijewel.com/open.png"],
  },

  alternates: {
    canonical: "https://ruverijewel.com/kids-collection",
  },
};

export default function Home() {
  return (
    <>
      <Products category="kidscollections" title="Kids Collections" />
    </>
  );
}