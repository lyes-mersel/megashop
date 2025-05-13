import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";

export default function OrderHeader() {
  return (
    <div className="flex items-center mb-6">
      <Link href="/cart" className="mr-4">
        <FaArrowLeft className="text-black text-xl hover:text-gray-700 transition-colors" />
      </Link>
      <h2
        className={cn(
          integralCF.className,
          "font-bold text-[32px] md:text-[40px] text-black uppercase"
        )}
      >
        Passer la commande
      </h2>
    </div>
  );
}
