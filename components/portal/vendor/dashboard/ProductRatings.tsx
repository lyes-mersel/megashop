"use client";

import { Star } from "lucide-react";
import { VendorDashboardStats } from "@/lib/types/dashboard.types";

interface ProductRatingsProps {
  stats: VendorDashboardStats;
}

// Fonction utilitaire pour générer les étoiles en fonction de la note et de la couleur
const renderStars = (rating: number, color: string) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, index) => (
        <Star
          key={`full-${index}`}
          className={`h-4 w-4 sm:h-5 sm:w-5 ${color} transition-transform duration-300 hover:scale-110`}
        />
      ))}
      {hasHalfStar && (
        <div className="relative h-4 w-4 sm:h-5 sm:w-5">
          <Star className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: "50%" }}
          >
            <Star
              className={`h-4 w-4 sm:h-5 sm:w-5 ${color} transition-transform duration-300 hover:scale-110`}
            />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <Star
          key={`empty-${index}`}
          className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 transition-transform duration-300 hover:scale-110"
        />
      ))}
    </div>
  );
};

export default function ProductRatings({ stats }: ProductRatingsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
      <div className="data-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-purple-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-purple-50 hover:border-purple-600">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="bg-purple-100 p-2 rounded-full transition-all duration-300 group-hover:bg-purple-200 flex-shrink-0">
              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600">
                Meilleure note produit
              </h3>
              <p className="text-lg sm:text-xl font-bold text-gray-900 truncate" title={stats.meilleurProduit?.nom || "Aucun produit"}>
                {stats.meilleurProduit?.nom || "Aucun produit"}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {stats.meilleurProduit ? `${stats.meilleurProduit.noteMoyenne}/5 (${stats.meilleurProduit.totalEvaluations} avis)` : "Aucune évaluation"}
              </p>
            </div>
          </div>
          <div className="flex items-center flex-shrink-0">
            {stats.meilleurProduit && renderStars(
              parseFloat(stats.meilleurProduit.noteMoyenne),
              "text-purple-500 fill-purple-500"
            )}
          </div>
        </div>
      </div>

      <div className="data-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-red-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-red-50 hover:border-red-600">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="bg-red-100 p-2 rounded-full transition-all duration-300 group-hover:bg-red-200 flex-shrink-0">
              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600">
                Pire note produit
              </h3>
              <p className="text-lg sm:text-xl font-bold text-gray-900 truncate" title={stats.pireProduit?.nom || "Aucun produit"}>
                {stats.pireProduit?.nom || "Aucun produit"}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {stats.pireProduit ? `${stats.pireProduit.noteMoyenne}/5 (${stats.pireProduit.totalEvaluations} avis)` : "Aucune évaluation"}
              </p>
            </div>
          </div>
          <div className="flex items-center flex-shrink-0">
            {stats.pireProduit && renderStars(
              parseFloat(stats.pireProduit.noteMoyenne),
              "text-red-500 fill-red-500"
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 