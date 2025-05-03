import React from "react";
import Rating from "../ui/Rating";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types/product.types";

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  return (
    <Link
      href={`/product/${data.id}`}
      className="flex flex-col items-start aspect-auto"
    >
      <div className="bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden">
        <Image
          src={data.srcUrl}
          width={295}
          height={298}
          className="rounded-md w-full h-full object-contain hover:scale-110 transition-all duration-500"
          alt={data.title}
          priority
        />
      </div>
      <strong className="text-black xl:text-xl">{data.title}</strong>
      <div className="flex items-end mb-1 xl:mb-2">
        <Rating
          initialValue={data.rating}
          allowFraction
          SVGclassName="inline-block"
          emptyClassName="fill-gray-50"
          size={19}
          readonly
        />
        <span className="text-black text-xs xl:text-sm ml-[11px] xl:ml-[13px] pb-0.5 xl:pb-0">
          {data.rating.toFixed(1)}
          <span className="text-black/60">/5</span>
        </span>
      </div>
      <div className="flex items-center justify-between w-full">
        <span className="font-bold text-black text-xl xl:text-2xl">
          ${data.price}
        </span>

        {data.type === "marketplace" ? (
          <div className="relative group">
            <div className="text-xs xl:text-sm bg-[#F0EEED] text-gray-700 font-medium px-2.5 py-1 rounded-full">
              Produit Marketplace
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 z-10 w-max max-w-[200px] text-center">
              Vendu par un vendeur tiers inscrit sur notre plateforme.
            </div>
          </div>
        ) : (
          <div className="relative group">
            <div className="text-xs xl:text-sm bg-[#F0EEED] text-black font-medium px-2.5 py-1 rounded-full">
              Produit officiel
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 z-10 w-max max-w-[200px] text-center">
              Vendu et expédié directement par notre boutique.
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
