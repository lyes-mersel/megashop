"use client";

import { DollarSign, ShoppingBag, Package } from "lucide-react";
import { VendorDashboardStats } from "@/lib/types/dashboard.types";

interface DashboardStatsProps {
  stats: VendorDashboardStats;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div className="data-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-green-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-green-50 hover:border-green-600 h-[72px] sm:h-[84px] flex items-center">
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          <div className="bg-green-100 p-2 rounded-full transition-all duration-300 group-hover:bg-green-200">
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">
              Total des ventes
            </h3>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {stats.totalVentes?.toLocaleString() || 0} DZD
            </p>
          </div>
        </div>
      </div>

      <div className="data-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-blue-50 hover:border-blue-600 h-[72px] sm:h-[84px] flex items-center">
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          <div className="bg-blue-100 p-2 rounded-full transition-all duration-300 group-hover:bg-blue-200">
            <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">
              Total des produits
            </h3>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {stats.totalProduits} produits
            </p>
          </div>
        </div>
      </div>

      <div className="data-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-teal-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-teal-50 hover:border-teal-600 h-[72px] sm:h-[84px] flex items-center">
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          <div className="bg-teal-100 p-2 rounded-full transition-all duration-300 group-hover:bg-teal-200">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">
              Produits vendus
            </h3>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {stats.produitsVendus || 0} articles vendus
            </p>
          </div>
        </div>
      </div>

      <div className="data-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-yellow-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-yellow-50 hover:border-yellow-600 h-[72px] sm:h-[84px] flex items-center">
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          <div className="bg-yellow-100 p-2 rounded-full transition-all duration-300 group-hover:bg-yellow-200">
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">
              Produit avec plus de revenus
            </h3>
            <p className="text-base sm:text-lg font-bold text-gray-900 truncate" title={stats.produitPlusRevenu?.nom || "Aucun produit"}>
              {stats.produitPlusRevenu?.nom || "Aucun produit"}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 truncate">
              {stats.produitPlusRevenu?.totalRevenu?.toLocaleString() || 0} DZD de revenus
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 