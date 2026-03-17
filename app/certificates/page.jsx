import Image from "next/image";

export default function ScreenshotPage() {
  return (
    <div className="w-screen h-screen relative bg-back">
      <Image
        src="/certificate.png" // place your screenshot in /public
        alt="certificate"
        fill
        priority
        className="object-contain"
      />
    </div>
  );
}