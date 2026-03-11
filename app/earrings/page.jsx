import Products from "../nopage/home/Products";

export const metadata = {
  title: "Gold, Silver & Diamond Earrings for Women | Ruveri Jewel",
  description:
    "Shop elegant gold, silver, and diamond earrings at Ruveri Jewel. Discover stylish stud, hoop, and designer earrings crafted for modern elegance. Luxury jewelry with worldwide shipping.",
  keywords: [
    "gold earrings",
    "diamond earrings",
    "silver earrings",
    "earrings for women",
    "stud earrings",
    "hoop earrings",
    "designer earrings",
    "buy earrings online",
    "gold jewelry",
    "diamond jewelry",
    "silver jewelry",
    "Ruveri Jewel",
  ],

  logo1Graph: {
    title: "Luxury Gold, Silver & Diamond Earrings | Ruveri Jewel",
    description:
      "Explore the stunning earrings collection at Ruveri Jewel. Premium gold, silver, and diamond earrings designed for timeless elegance.",
    url: "https://ruverijewel.com/earrings",
    siteName: "Ruveri Jewel",
    images: [
      {
        url: "https://ruverijewel.com/logo1.png",
        width: 1200,
        height: 630,
        alt: "Luxury Earrings Collection by Ruveri Jewel",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Designer Gold, Silver & Diamond Earrings | Ruveri Jewel",
    description:
      "Shop beautiful gold, silver, and diamond earrings at Ruveri Jewel. Elegant designs perfect for everyday wear and special occasions.",
    images: ["https://ruverijewel.com/logo1.png"],
  },

  alternates: {
    canonical: "https://ruverijewel.com/earrings",
  },
};

export default function Home() {
  return (
    <>
      <Products
        category="earrings"
        title="Earrings"
      />
    </>
  );
}