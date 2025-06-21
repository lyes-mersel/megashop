"use client";

import Image from "next/image";
import { SellFromAPI } from "@/lib/types/sell.types";
import { extractDateString, getImageUrlFromPublicId } from "@/lib/utils";

interface DesktopSellsTableProps {
  sells: SellFromAPI[];
  onSellClick: (sell: SellFromAPI) => void;
}

export default function DesktopSellsTable({ sells, onSellClick }: DesktopSellsTableProps) {
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
    <div className="hidden sm:block bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                Image
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                Produit
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                Quantité
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden md:table-cell">
                Couleur
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden lg:table-cell">
                Taille
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden md:table-cell">
                Client
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden lg:table-cell">
                Date
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sells.map((sell) => (
              <tr
                key={sell.id}
                className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                onClick={() => onSellClick(sell)}
              >
                <td className="px-4 py-2 sm:px-6 sm:py-4">
                  <Image
                    width={32}
                    height={32}
                    src={sell.imagePublicId ? getImageUrlFromPublicId(sell.imagePublicId) : "/images/no-image.png"}
                    alt={sell.nomProduit}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                  />
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
                  {sell.nomProduit}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
                  {sell.quantite}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                  {sell.couleur ? (
                    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {sell.couleur.nom}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">N/A</span>
                  )}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                  {sell.taille ? (
                    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {sell.taille.nom}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">N/A</span>
                  )}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                  <div>
                    <span className="font-semibold">
                      {sell.commande.client ? `${sell.commande.client.nom} ${sell.commande.client.prenom}` : "Client inconnu"}
                    </span>
                    <p className="text-xs text-gray-600">
                      {sell.commande.client?.email || "Email non disponible"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                  {extractDateString(sell.commande.date)}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm font-semibold text-green-600">
                  {sell.total.toFixed(2)} DA
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 