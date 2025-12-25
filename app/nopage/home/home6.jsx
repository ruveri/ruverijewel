import Image from "next/image";

export default function FeaturesSection() {
  const features = [
    {
      title: "Safe Return Process",
      description: "Secure and hassle-free return process.",
      icon: "/m1.png",
    },
    {
      title: "Fast Delivery",
      description: "Receive your order faster than ever before!",
      icon: "/m2.png",
    },
    {
      title: "Quality Products",
      description: "Presented in an elegant jewelry, perfect for gift.",
      icon: "/m3.png",
    },
  ];

  return (
    <section className="w-full bg-back py-12">
      <div className="px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center px-2"
            >
              {/* Icon wrapper (fixed height + bottom aligned) */}
              <div className="mb-4 h-24 flex items-end justify-center">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-base leading-snug max-w-sm">
                {item.description}
              </p>
            </div>
          ))}

          {/* Vertical Dividers (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-1/3 -translate-y-1/2 h-20 w-px bg-gray-300"></div>
          <div className="hidden md:block absolute top-1/2 left-2/3 -translate-y-1/2 h-20 w-px bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
}
