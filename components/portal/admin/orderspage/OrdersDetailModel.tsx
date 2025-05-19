"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import { OrderFromAPI } from "@/lib/types/order.types";
import { extractDateString } from "@/lib/utils";
import { getStatusColor, getStatusLabel } from "@/lib/helpers/orderStatus";

interface OrderDetailModalProps {
  order: OrderFromAPI | null;
  onClose: () => void;
}

export default function OrderDetailModal({
  order,
  onClose,
}: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-[90%] sm:max-w-3xl w-full p-4 sm:p-8 border border-gray-200 overflow-y-auto max-h-[calc(100dvh-100px)] relative"
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

        <div className="space-y-4 sm:space-y-6">
          {/* En-tête de la commande */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-3 sm:pb-4 mt-1">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Commande #{order.id}
            </h3>
            <span
              className={`px-3 py-1 rounded-full font-bold ${getStatusColor(
                order.statut!
              )}`}
            >
              {getStatusLabel(order.statut)}
            </span>
          </div>

          {/* Informations vendeur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-xl">
            <div>
              <span className="text-gray-700 font-semibold text-sm sm:text-base">
                Client :
              </span>
              <span className="text-gray-900 block text-sm sm:text-base font-semibold">
                {order.client?.prenom} {order.client?.nom}
              </span>
            </div>

            <div>
              <span className="text-gray-700 font-semibold text-sm sm:text-base">
                Date :
              </span>
              <span className="text-gray-900 block text-sm sm:text-base font-semibold">
                {extractDateString(order.date)}
              </span>
            </div>

            <div>
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                Adresse :
              </span>
              <span className="text-gray-900 font-semibold block text-sm sm:text-base">
                {`${order.adresse?.rue}, ${order.adresse?.ville}, ${order.adresse?.wilaya} - ${order.adresse?.codePostal}`}
              </span>
            </div>

            <div>
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                Articles :
              </span>
              <span className="text-gray-900 font-semibold block text-sm sm:text-base">
                {order.produits.length}
              </span>
            </div>
          </div>

          {/* Liste des produits */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
              Détails des articles
            </h4>
            <div className="space-y-3">
              {order.produits.map((produit, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-2 last:border-b-0"
                >
                  <div className="flex-1">
                    <span className="text-gray-900 font-medium text-sm sm:text-base">
                      {produit.nomProduit}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Couleur: {produit.couleur?.nom}, Taille:{" "}
                      {produit.taille?.nom}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Quantité: {produit.quantite}
                    </p>
                  </div>
                  <span className="text-gray-900 font-semibold text-sm sm:text-base mt-1 sm:mt-0">
                    {(produit.prixUnit * produit.quantite).toFixed(2)} DA
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-green-50 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-green-700 font-medium text-base sm:text-lg">
              Total de la commande :
            </span>
            <span className="text-green-900 font-bold text-lg sm:text-2xl">
              {order.montant.toFixed(2)} DA
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
