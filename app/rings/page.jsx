import Products from "../nopage/home/Products";

export const metadata = {
  title: "Custom Single Name Necklaces – Personalized Name Jewelry | Erroneous Gold",
  description:
    "Shop beautifully crafted Single Name Necklaces at Erroneous Gold. Create your personalized name necklace – a stylish and meaningful accessory or gift.",
  keywords: [
    "single name necklace",
    "custom name necklace",
    "personalized jewelry",
    "engraved necklace",
    "name pendant",
    "custom name jewelry",
    "personalized necklace india",
    "name necklace gift",
    "erroneous gold",
  ],
  openGraph: {
    title: "Custom Single Name Necklaces | Erroneous Gold",
    description:
      "Design your own single name necklace with Erroneous Gold. Personalized jewelry handcrafted with care – perfect for daily wear or gifting.",
    url: "https://erroneousgold.com/singlenamenecklace",
    siteName: "Erroneous Gold",
    images: [
      {
        url: "https://erroneousgold.com/open.png",
        width: 1200,
        height: 630,
        alt: "Single Name Necklace – Personalized Jewelry by Erroneous Gold",
      },
    ],
    locale: "en_IN",
    
  },
  twitter: {
    card: "summary_large_image",
    title: "Personalized Single Name Necklaces | Erroneous Gold",
    description:
      "Shop elegant, custom-made single name necklaces. Personalized jewelry handcrafted with love by Erroneous Gold.",
    images: ["https://erroneousgold.com/open.png"],
  },
  alternates: {
    canonical: "https://erroneousgold.com/singlenamenecklace",
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
