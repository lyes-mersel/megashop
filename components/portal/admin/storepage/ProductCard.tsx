import { useState, useEffect } from "react";
import { ProductFromAPI } from "@/lib/types/product.types";
import { Edit, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { montserrat } from "@/styles/fonts";
import { getImageUrlFromPublicId } from "@/lib/utils";
import { toast } from "sonner";

interface ProductCardProps {
  product: ProductFromAPI;
  onEdit: (product: ProductFromAPI) => void;
  onDelete: (product: ProductFromAPI) => void;
  onShowDetails: (product: ProductFromAPI) => void;
  index: number;
}

export const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onShowDetails,
  index,
}: ProductCardProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-slide-in"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => isMobile && setShowActions(!showActions)}
    >
      <div className="relative h-65 w-full">
        <Image
          fill
          src={
            product.images[0]?.imagePublicId
              ? getImageUrlFromPublicId(product.images[0]?.imagePublicId)
              : "/images/placeholder.png"
          }
          alt={product.nom}
          className="object-cover"
        />
        <div
          className={`absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300 bg-black/40 ${
            isMobile
              ? showActions
                ? "opacity-100"
                : "opacity-0"
              : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.type === "boutique") {
                onEdit(product);
              } else
                toast.error(
                  "Vous ne pouvez pas modifier les modifier les produits de la marketplace"
                );
            }}
            className="bg-black text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-all duration-200 shadow-md font-bold"
          >
            <Edit className="h-4 w-4" /> Modifier
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product);
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-all duration-200 shadow-md font-bold"
          >
            <Trash2 className="h-4 w-4" /> Supprimer
          </button>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.nom}
        </h2>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-bold">Type :</span>{" "}
            {product.type ? product.type.toString().toUpperCase() : ""}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Note :</span> {product.noteMoyenne} / 5
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Quantité :</span> {product.qteStock}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`text-lg font-semibold text-gray-900 ${montserrat.className}`}
          >
            DA {product.prix.toFixed(2)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowDetails(product);
            }}
            className="group/detail bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-1 font-semibold"
          >
            Détails
            <ArrowRight className="h-4 w-4 opacity-0 group-hover/detail:opacity-100 transition-opacity duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
