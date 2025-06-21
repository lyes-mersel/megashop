"use client";

import Image from "next/image";
import { SellFromAPI } from "./types";
import { extractDateString, getImageUrlFromPublicId } from "@/lib/utils";

interface MobileSalesCardsProps {
  sales: SellFromAPI[];
  onSaleClick: (sale: SellFromAPI) => void;
}

export default function MobileSalesCards({
  sales,
  onSaleClick,
}: MobileSalesCardsProps) {
  const getImageUrl = (imagePublicId: string | null) => {
    if (!imagePublicId) {
      return "/images/no-image.png";
    }
    return getImageUrlFromPublicId(imagePublicId);
  };

  const getClientName = (sale: SellFromAPI) => {
    if (!sale.commande.client) return "Client inconnu";
    return `${sale.commande.client.nom} ${sale.commande.client.prenom}`;
  };

  if (sales.length === 0) {
    return (
      <div className="text-center py-12">
        <Image
          width={100}
          height={100}
          src="/images/not-found.png"
          alt="Aucune vente"
          className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4"
        />
        <p className="text-lg sm:text-xl font-semibold text-gray-800">
          Aucune vente trouvée
        </p>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Aucun résultat ne correspond à votre recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="sm:hidden">
      {sales.map((sale) => (
        <div
          key={sale.id}
          className="bg-white rounded-xl shadow-lg p-4 mb-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
          onClick={() => onSaleClick(sale)}
        >
          <div className="flex items-center gap-3 mb-2">
            <Image
              width={30}
              height={30}
              src={getImageUrl(sale.imagePublicId)}
              alt={sale.nomProduit}
              className="w-10 h-10 object-cover rounded-md"
            />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {sale.nomProduit}
              </h3>
              <p className="text-xs text-gray-600">{getClientName(sale)}</p>
            </div>
          </div>
          <div className="text-xs text-gray-600 mb-1">
            Quantité: {sale.quantite}
          </div>
          <div className="text-xs text-gray-600 mb-1">
            Date: {extractDateString(sale.commande.date)}
          </div>
          <div className="text-xs font-semibold text-green-600">
            Total: {sale.total.toFixed(2)} DA
          </div>
        </div>
      ))}
    </div>
  );
} 