import Products from "../nopage/home/Products";

export const metadata = {
  title: "Designer Pendents – Unique & Stylish Pendants | Erroneous Gold",
  description:
    "Discover our collection of Designer Pendents at Erroneous Gold. Unique, stylish, and elegant pendants perfect for gifting or adding a touch of sophistication to your look.",
  keywords: [
    "designer pendents",
    "unique pendants",
    "stylish pendents",
    "fashion pendants",
    "gift pendants",
    "custom pendents india",
    "personalized pendents",
    "fashion accessories",
    "erroneous gold",
  ],
  openGraph: {
    title: "Designer Pendents Collection | Erroneous Gold",
    description:
      "Shop Designer Pendents from Erroneous Gold. Unique and stylish pendants crafted to enhance your style or make a perfect gift.",
    url: "https://erroneousgold.com/designerpendents",
    siteName: "Erroneous Gold",
    images: [
      {
        url: "https://erroneousgold.com/open.png",
        width: 1200,
        height: 630,
        alt: "Designer Pendents – Stylish Pendants by Erroneous Gold",
      },
    ],
    locale: "en_IN",
    
  },
  twitter: {
    card: "summary_large_image",
    title: "Designer Pendents – Unique & Stylish Pendants | Erroneous Gold",
    description:
      "Explore Designer Pendents from Erroneous Gold. Perfectly crafted pendants with unique designs for gifting or personal style.",
    images: ["https://erroneousgold.com/open.png"],
  },
  alternates: {
    canonical: "https://erroneousgold.com/designerpendents",
  },
};

export default function Home() {
  return (
    <>
      <Products category="necklace" title="Necklace" />
    </>
  );
}
