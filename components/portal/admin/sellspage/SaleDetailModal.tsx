"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SellFromAPI } from "./types";
import { extractDateString, getImageUrlFromPublicId } from "@/lib/utils";

interface SaleDetailModalProps {
  sale: SellFromAPI | null;
  onClose: () => void;
}

export default function SaleDetailModal({
  sale,
  onClose,
}: SaleDetailModalProps) {
  if (!sale) return null;

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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-2xl p-4 sm:p-6 border border-gray-100"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Image du produit */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
            <Image
              width={100}
              height={100}
              src={getImageUrl(sale.imagePublicId)}
              alt={sale.nomProduit}
              className="w-full h-full object-cover rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
          </div>
          <div className="flex-grow space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {sale.nomProduit}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-700 font-medium text-xs sm:text-sm">
                  Client :
                </span>
                <span className="text-gray-900 font-semibold block text-xs sm:text-sm">
                  {getClientName(sale)}
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-700 font-medium text-xs sm:text-sm">
                  Email :
                </span>
                <span className="text-gray-900 block text-xs sm:text-sm">
                  {sale.commande.client?.email || "N/A"}
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-700 font-medium text-xs sm:text-sm">
                  Date :
                </span>
                <span className="text-gray-900 block text-xs sm:text-sm">
                  {extractDateString(sale.commande.date)}
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-700 font-medium text-xs sm:text-sm">
                  Quantité :
                </span>
                <span className="text-gray-900 font-semibold block text-xs sm:text-sm">
                  {sale.quantite}
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-700 font-medium text-xs sm:text-sm">
                  Prix Unitaire :
                </span>
                <span className="text-gray-900 block text-xs sm:text-sm">
                  {sale.prixUnit.toFixed(2)} DA
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-700 font-medium text-xs sm:text-sm">
                  Statut :
                </span>
                <span className="text-gray-900 block text-xs sm:text-sm">
                  {sale.commande.statut}
                </span>
              </div>
            </div>
            <div className="bg-green-50 p-2 rounded-lg flex justify-between items-center">
              <span className="text-green-700 font-medium text-xs sm:text-sm">
                Total :
              </span>
              <span className="text-green-900 font-bold text-base sm:text-lg">
                {sale.total.toFixed(2)} DA
              </span>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <span className="text-gray-700 font-medium block mb-1 text-xs sm:text-sm">
                Détails :
              </span>
              <div className="space-y-1">
                <div className="flex justify-between text-xs sm:text-sm text-gray-900">
                  <span>Couleur :</span>
                  <span className="font-semibold">
                    {sale.couleur?.nom || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-900">
                  <span>Taille :</span>
                  <span className="font-semibold">
                    {sale.taille?.nom || "N/A"}
                  </span>
                </div>
                {sale.commande.client?.tel && (
                  <div className="flex justify-between text-xs sm:text-sm text-gray-900">
                    <span>Téléphone :</span>
                    <span className="font-semibold">
                      {sale.commande.client.tel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 