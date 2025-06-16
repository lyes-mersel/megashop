import { useState } from "react";
import { Search, Filter, Download } from "lucide-react";

// Types
import { UserType, SortConfig, SortField } from "@/lib/types/user.types";

interface UserFiltersProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortConfig: SortConfig | null;
  setSortConfig: (config: SortConfig | null) => void;
  onExport: () => void;
}

export function UserFilters({
  userType,
  setUserType,
  searchQuery,
  setSearchQuery,
  // sortConfig,
  setSortConfig,
  onExport,
}: UserFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleSortChange = (key: SortField, direction: "asc" | "desc") => {
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {userType === "CLIENT" ? "Clients" : "Vendeurs"}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setUserType("CLIENT")}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition ${
                userType === "CLIENT"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Clients
            </button>
            <button
              onClick={() => setUserType("VENDEUR")}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition ${
                userType === "VENDEUR"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Vendeurs
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition flex-1 sm:flex-none"
            >
              <Filter className="h-4 w-4" />
            </button>
            <button
              onClick={onExport}
              className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition flex items-center gap-1 flex-1 sm:flex-none"
            >
              <Download className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Exporter</span>
            </button>
          </div>
        </div>
      </div>
      {showFilters && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row flex-wrap gap-3">
          <div className="w-full sm:w-auto">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Trier par nom
            </label>
            <select
              onChange={(e) => {
                const value = e.target.value;
                if (value) handleSortChange("name", value as "asc" | "desc");
                else setSortConfig(null);
              }}
              className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm"
            >
              <option value="">Aucun</option>
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Trier par date
            </label>
            <select
              onChange={(e) => {
                const value = e.target.value;
                if (value)
                  handleSortChange("createdAt", value as "asc" | "desc");
                else setSortConfig(null);
              }}
              className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm"
            >
              <option value="">Aucun</option>
              <option value="asc">Plus ancien</option>
              <option value="desc">Plus récent</option>
            </select>
          </div>
          {userType === "CLIENT" ? (
            <>
              <div className="w-full sm:w-auto">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Trier par commandes
                </label>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value)
                      handleSortChange("orders", value as "asc" | "desc");
                    else setSortConfig(null);
                  }}
                  className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm"
                >
                  <option value="">Aucun</option>
                  <option value="asc">Croissant</option>
                  <option value="desc">Décroissant</option>
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Trier par dépense
                </label>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value)
                      handleSortChange("expenses", value as "asc" | "desc");
                    else setSortConfig(null);
                  }}
                  className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm"
                >
                  <option value="">Aucun</option>
                  <option value="asc">Croissant</option>
                  <option value="desc">Décroissant</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="w-full sm:w-auto">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Trier par produits vendus
                </label>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value)
                      handleSortChange(
                        "produitsVendus",
                        value as "asc" | "desc"
                      );
                    else setSortConfig(null);
                  }}
                  className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm"
                >
                  <option value="">Aucun</option>
                  <option value="asc">Croissant</option>
                  <option value="desc">Décroissant</option>
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Trier par total ventes
                </label>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value)
                      handleSortChange("totalVentes", value as "asc" | "desc");
                    else setSortConfig(null);
                  }}
                  className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm"
                >
                  <option value="">Aucun</option>
                  <option value="asc">Croissant</option>
                  <option value="desc">Décroissant</option>
                </select>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
