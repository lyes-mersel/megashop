"use client";

import Image from "next/image";
import { SellFromAPI } from "@/lib/types/sell.types";
import { extractDateString, getImageUrlFromPublicId } from "@/lib/utils";

interface MobileSellsCardsProps {
  sells: SellFromAPI[];
  onSellClick: (sell: SellFromAPI) => void;
}

export default function MobileSellsCards({ sells, onSellClick }: MobileSellsCardsProps) {
  if (sells.length === 0) {
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
      {sells.map((sell) => (
        <div
          key={sell.id}
          className="bg-white rounded-xl shadow-lg p-4 mb-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
          onClick={() => onSellClick(sell)}
        >
          <div className="flex items-center gap-3 mb-2">
            <Image
              width={30}
              height={30}
              src={sell.imagePublicId ? getImageUrlFromPublicId(sell.imagePublicId) : "/images/no-image.png"}
              alt={sell.nomProduit}
              className="w-10 h-10 object-cover rounded-md"
            />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {sell.nomProduit}
              </h3>
              <p className="text-xs text-gray-600">
                {sell.commande.client ? `${sell.commande.client.nom} ${sell.commande.client.prenom}` : "Client inconnu"}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-600 mb-1">
            Quantité: {sell.quantite}
          </div>
          <div className="text-xs text-gray-600 mb-1">
            Date: {extractDateString(sell.commande.date)}
          </div>
          <div className="text-xs font-semibold text-green-600">
            Total: {sell.total.toFixed(2)} DA
          </div>
        </div>
      ))}
    </div>
  );
} 