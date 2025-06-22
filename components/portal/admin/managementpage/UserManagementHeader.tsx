import { useState } from "react";
import { Search, Filter, Download, Users, User, Store } from "lucide-react";
import { montserrat } from "@/styles/fonts";

// Types
import { UserType, SortConfig, SortField } from "@/lib/types/user.types";



interface UserManagementHeaderProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortConfig: SortConfig | null;
  setSortConfig: (config: SortConfig | null) => void;
  onExport: () => void;
}

export function UserManagementHeader({
  userType,
  setUserType,
  searchQuery,
  setSearchQuery,
  sortConfig,
  setSortConfig,
  onExport,
}: UserManagementHeaderProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (field: SortField) => {
    if (!sortConfig || sortConfig.key !== field) {
      setSortConfig({ key: field, direction: "asc" });
    } else if (sortConfig.direction === "asc") {
      setSortConfig({ key: field, direction: "desc" });
    } else {
      setSortConfig(null);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Users className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
        <h1
          className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Gestion des utilisateurs
        </h1>
      </div>

      <div className="mb-8">
        <p
          className={`text-base sm:text-lg text-gray-700 ${montserrat.className}`}
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Gérez efficacement vos clients et vendeurs depuis cette interface.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
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
                  <User className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" /> Clients
                </button>
                <button
                  onClick={() => setUserType("VENDEUR")}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition ${
                    userType === "VENDEUR"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Store className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />{" "}
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
                  onChange={(_e) => handleSort("name")}
                  className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Aucun</option>
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                </select>
              </div>
              {userType === "CLIENT" ? (
                <>
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Trier par commandes
                    </label>
                    <select
                      onChange={(_e) => handleSort("orders")}
                      className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                      onChange={(_e) => handleSort("expenses")}
                      className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Aucun</option>
                      <option value="asc">Croissant</option>
                      <option value="desc">Décroissant</option>
                    </select>
                  </div>
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Trier par date
                    </label>
                    <select
                      onChange={(_e) => handleSort("createdAt")}
                      className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Aucun</option>
                      <option value="asc">Plus ancien</option>
                      <option value="desc">Plus récent</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Trier par date
                    </label>
                    <select
                      onChange={(_e) => handleSort("createdAt")}
                      className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Aucun</option>
                      <option value="asc">Plus ancien</option>
                      <option value="desc">Plus récent</option>
                    </select>
                  </div>
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Trier par produits vendus
                    </label>
                    <select
                      onChange={(_e) => handleSort("produitsVendus")}
                      className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                      onChange={(_e) => handleSort("totalVentes")}
                      className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
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
      </div>
    </>
  );
}
