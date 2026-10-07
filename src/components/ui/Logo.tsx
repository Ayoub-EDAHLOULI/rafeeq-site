import Image from "next/image";
import logo from "@/assets/logo.png";

// Mark plus name. The name is visible text, so the image is decorative.
export default function Logo({ size = "md" }: { size?: "md" | "sm" }) {
  const px = size === "md" ? 32 : 28;
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src={logo}
        alt=""
        width={px}
        height={px}
        className={size === "md" ? "rounded-[9px]" : "rounded-lg"}
      />
      <span
        className={`font-semibold tracking-[-0.01em] text-text ${
          size === "md" ? "text-lg" : "text-[17px]"
        }`}
      >
        Rafeeq
      </span>
    </span>
  );
}
