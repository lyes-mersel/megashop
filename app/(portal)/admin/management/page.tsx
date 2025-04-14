"use client";

import { useState } from "react";
import {
  Users,
  Trash2,
  Search,
  User,
  Store,
  AlertTriangle,
  Filter,
  Download,
  ChevronDown,
  X,
  Mail,
} from "lucide-react";
import { Montserrat } from "next/font/google";
import { motion } from "framer-motion";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import Image from "next/image";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

interface Address {
  street: string;
  province: string;
  postalCode: string;
}

interface BaseUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  phone?: string;
  address?: Address;
  image?: string;
  status: "active" | "suspended" | "pending";
}

interface Client extends BaseUser {
  ordersCount: number;
  totalSpent: number;
}

interface Seller extends BaseUser {
  shopName: string;
  reportsCount: number;
  productsCount: number;
  rating: number;
}

export default function UsersPage() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      firstName: "Ahmed",
      lastName: "Ben Salah",
      email: "ahmed.bensalah@example.com",
      createdAt: "2024-01-15",
      phone: "+216 20 123 456",
      address: { street: "Rue Tunis", province: "Tunis", postalCode: "1000" },
      image: "/images/u1.jpg",
      status: "active",
      ordersCount: 12,
      totalSpent: 1240.5,
    },
    {
      id: 2,
      firstName: "Fatima",
      lastName: "Zouari",
      email: "fatima.zouari@example.com",
      createdAt: "2024-03-10",
      phone: "+216 25 678 901",
      address: {
        street: "Avenue Habib Bourguiba",
        province: "Sousse",
        postalCode: "4000",
      },
      image: "",
      status: "active",
      ordersCount: 8,
      totalSpent: 850.75,
    },
  ]);

  const [sellers, setSellers] = useState<Seller[]>([
    {
      id: 1,
      firstName: "Karim",
      lastName: "Haddad",
      email: "karim.haddad@example.com",
      createdAt: "2023-11-05",
      shopName: "Karim Fashion",
      phone: "+216 22 987 654",
      address: {
        street: "Avenue Carthage",
        province: "Sfax",
        postalCode: "3000",
      },
      image: "/images/u2.jpg",
      status: "active",
      reportsCount: 2,
      productsCount: 45,
      rating: 4.2,
    },
    {
      id: 2,
      firstName: "Leila",
      lastName: "Mansouri",
      email: "leila.mansouri@example.com",
      createdAt: "2024-02-20",
      shopName: "Leila Boutique",
      phone: "+216 29 456 789",
      address: {
        street: "Rue de la République",
        province: "Bizerte",
        postalCode: "7000",
      },
      image: "",
      status: "active",
      reportsCount: 0,
      productsCount: 20,
      rating: 4.8,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [userType, setUserType] = useState<"client" | "seller">("client");
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    type: "client" | "seller";
  } | null>(null);
  const [userToWarn, setUserToWarn] = useState<Seller | null>(null);
  const [selectedUser, setSelectedUser] = useState<Client | Seller | null>(
    null
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [warningMessage, setWarningMessage] = useState("");

  const getFilteredUsers = () => {
    let users = userType === "client" ? [...clients] : [...sellers];

    users = users.filter((user) => {
      const searchTerms = searchQuery.toLowerCase();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(searchTerms) ||
        user.email.toLowerCase().includes(searchTerms)
      );
    }) as Client[] | Seller[];

    if (sortConfig) {
      users.sort((a, b) => {
        if (sortConfig.key === "fullName") {
          const aFullName = `${a.firstName} ${a.lastName}`.toLowerCase();
          const bFullName = `${b.firstName} ${b.lastName}`.toLowerCase();
          return sortConfig.direction === "asc"
            ? aFullName.localeCompare(bFullName)
            : bFullName.localeCompare(aFullName);
        }
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        if ((aValue ?? 0) < (bValue ?? 0))
          return sortConfig.direction === "asc" ? -1 : 1;
        if ((aValue ?? 0) > (bValue ?? 0))
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return users;
  };

  const filteredUsers = getFilteredUsers();

  const exportToExcel = () => {
    const data = filteredUsers.map((user) => {
      const address = user.address
        ? `${user.address.street}, ${user.address.province}, ${user.address.postalCode}`
        : "Non renseignée";
      if (userType === "client") {
        const client = user as Client;
        return {
          ID: client.id,
          Prénom: client.firstName,
          Nom: client.lastName,
          Email: client.email,
          "Date de création": client.createdAt,
          Téléphone: client.phone || "Non renseigné",
          Adresse: address,
          "Nombre de commandes": client.ordersCount,
          "Total dépensé": client.totalSpent.toFixed(2),
        };
      } else {
        const seller = user as Seller;
        return {
          ID: seller.id,
          Prénom: seller.firstName,
          Nom: seller.lastName,
          Email: seller.email,
          "Date de création": seller.createdAt,
          Téléphone: seller.phone || "Non renseigné",
          Adresse: address,
          "Nom de la boutique": seller.shopName,
          Signalements: seller.reportsCount,
          Note: seller.rating.toFixed(1),
        };
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "D3D3D3" } },
      alignment: { horizontal: "center" },
    };
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:K1");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = headerStyle;
    }
    const colWidths =
      userType === "client"
        ? [5, 15, 15, 25, 15, 20, 30, 20, 15]
        : [5, 15, 15, 25, 15, 20, 30, 20, 15, 10];
    worksheet["!cols"] = colWidths.map((w) => ({ wch: w }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      userType === "client" ? "Clients" : "Vendeurs"
    );
    const filename = userType === "client" ? "clients.xlsx" : "vendeurs.xlsx";
    XLSX.writeFile(workbook, filename);
    toast.success(
      `Liste des ${
        userType === "client" ? "clients" : "vendeurs"
      } exportée avec succès`
    );
  };

  const handleDeleteUser = (id: number, type: "client" | "seller") => {
    setUserToDelete({ id, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      if (userToDelete.type === "client") {
        setClients(clients.filter((client) => client.id !== userToDelete.id));
      } else {
        setSellers(sellers.filter((seller) => seller.id !== userToDelete.id));
      }
      toast.success("Utilisateur supprimé avec succès");
    }
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleWarnSeller = (seller: Seller) => {
    setUserToWarn(seller);
    setShowWarningModal(true);
  };

  const sendWarning = () => {
    if (warningMessage.trim() === "") {
      toast.error("Veuillez entrer un message d'avertissement");
      return;
    }
    setTimeout(() => {
      toast.success(
        `Avertissement envoyé à ${userToWarn?.firstName} ${userToWarn?.lastName} avec succès`
      );
      setShowWarningModal(false);
      setWarningMessage("");
      setUserToWarn(null);
    }, 700);
  };

  const handleUserClick = (user: Client | Seller) => {
    setSelectedUser(user);
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getInitialsAndColor = (
    firstName: string,
    lastName: string,
    id: number
  ) => {
    const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
    const colors = [
      "bg-blue-600",
      "bg-emerald-600",
      "bg-purple-600",
      "bg-amber-600",
    ];
    return { initials, color: colors[id % colors.length] };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
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
                  {userType === "client" ? "Clients" : "Vendeurs"}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUserType("client")}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition ${
                      userType === "client"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <User className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />{" "}
                    Clients
                  </button>
                  <button
                    onClick={() => setUserType("seller")}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition ${
                      userType === "seller"
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
                    onClick={exportToExcel}
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
                    onChange={(_e) => handleSort("fullName")}
                    className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Aucun</option>
                    <option value="asc">A-Z</option>
                    <option value="desc">Z-A</option>
                  </select>
                </div>
                {userType === "client" ? (
                  <>
                    <div className="w-full sm:w-auto">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Trier par commandes
                      </label>
                      <select
                        onChange={(_e) => handleSort("ordersCount")}
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
                        onChange={(_e) => handleSort("totalSpent")}
                        className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
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
                        Trier par note
                      </label>
                      <select
                        onChange={(_e) => handleSort("rating")}
                        className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Aucun</option>
                        <option value="asc">Croissant</option>
                        <option value="desc">Décroissant</option>
                      </select>
                    </div>
                    <div className="w-full sm:w-auto">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Trier par signalements
                      </label>
                      <select
                        onChange={(_e) => handleSort("reportsCount")}
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

          {/* Affichage en cartes sur mobile, tableau sur desktop */}
          <div className="sm:hidden">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="border-b border-gray-200 p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {user.image ? (
                      <Image
                        width={8}
                        height={8}
                        src={user.image}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          getInitialsAndColor(
                            user.firstName,
                            user.lastName,
                            user.id
                          ).color
                        }`}
                      >
                        {
                          getInitialsAndColor(
                            user.firstName,
                            user.lastName,
                            user.id
                          ).initials
                        }
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    Date d&apos;inscription: {user.createdAt}
                  </div>
                  {userType === "client" ? (
                    <>
                      <div className="text-xs text-gray-600 mb-1">
                        Commandes: {(user as Client).ordersCount}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        Total dépensé: {(user as Client).totalSpent.toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <Store className="h-3 w-3 text-indigo-600" />
                        <span>{(user as Seller).shopName}</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        Note: {(user as Seller).rating.toFixed(1)}
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-end gap-2">
                    {userType === "seller" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWarnSeller(user as Seller);
                        }}
                        className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-all duration-200 shadow-sm"
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user.id, userType);
                      }}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-all duration-200 shadow-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                Aucun {userType === "client" ? "client" : "vendeur"} ne
                correspond à votre recherche.
              </div>
            )}
          </div>

          {/* Affichage en tableau sur desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("fullName")}
                  >
                    <div className="flex items-center gap-1">
                      Utilisateur
                      {sortConfig?.key === "fullName" && (
                        <ChevronDown
                          className={`h-4 w-4 ${
                            sortConfig.direction === "desc"
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden md:table-cell"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      Date d&apos;inscription
                      {sortConfig?.key === "createdAt" && (
                        <ChevronDown
                          className={`h-4 w-4 ${
                            sortConfig.direction === "desc"
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  {userType === "client" ? (
                    <>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                        onClick={() => handleSort("ordersCount")}
                      >
                        <div className="flex items-center gap-1">
                          Commandes
                          {sortConfig?.key === "ordersCount" && (
                            <ChevronDown
                              className={`h-4 w-4 ${
                                sortConfig.direction === "desc"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden xl:table-cell"
                        onClick={() => handleSort("totalSpent")}
                      >
                        <div className="flex items-center gap-1">
                          Total dépensé
                          {sortConfig?.key === "totalSpent" && (
                            <ChevronDown
                              className={`h-4 w-4 ${
                                sortConfig.direction === "desc"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          )}
                        </div>
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Boutique
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden xl:table-cell"
                        onClick={() => handleSort("rating")}
                      >
                        <div className="flex items-center gap-1">
                          Note
                          {sortConfig?.key === "rating" && (
                            <ChevronDown
                              className={`h-4 w-4 ${
                                sortConfig.direction === "desc"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          )}
                        </div>
                      </th>
                    </>
                  )}
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <Image
                              width={8}
                              height={8}
                              src={user.image}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold ${
                                getInitialsAndColor(
                                  user.firstName,
                                  user.lastName,
                                  user.id
                                ).color
                              }`}
                            >
                              {
                                getInitialsAndColor(
                                  user.firstName,
                                  user.lastName,
                                  user.id
                                ).initials
                              }
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 text-sm sm:text-base">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                        <div className="text-xs sm:text-sm text-gray-600">
                          {user.createdAt}
                        </div>
                      </td>
                      {userType === "client" ? (
                        <>
                          <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {(user as Client).ordersCount}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap hidden xl:table-cell">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {(user as Client).totalSpent.toFixed(2)}
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                            <div className="flex items-center gap-2">
                              <Store className="h-4 w-4 text-indigo-600" />
                              <span className="text-xs sm:text-sm font-medium text-gray-800">
                                {(user as Seller).shopName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap hidden xl:table-cell">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {(user as Seller).rating.toFixed(1)}
                            </div>
                          </td>
                        </>
                      )}
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {userType === "seller" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWarnSeller(user as Seller);
                              }}
                              className="bg-yellow-500 text-white p-2 sm:px-3 sm:py-1 rounded-md hover:bg-yellow-600 transition-all duration-200 shadow-sm"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user.id, userType);
                            }}
                            className="bg-red-500 text-white p-2 sm:px-3 sm:py-1 rounded-md hover:bg-red-600 transition-all duration-200 shadow-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={userType === "client" ? 5 : 5}
                      className="px-4 py-8 text-center text-gray-500 text-sm"
                    >
                      Aucun {userType === "client" ? "client" : "vendeur"} ne
                      correspond à votre recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white/30 backdrop-blur-lg border border-gray-200/50 p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[90%] sm:max-w-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Confirmer la suppression
              </h3>
              <p className="text-black-600 mb-6 text-sm sm:text-base">
                Êtes-vous sûr de vouloir supprimer cet utilisateur ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="bg-gray-200 text-gray-800 px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 text-sm sm:text-base"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {showWarningModal && userToWarn && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[90%] sm:max-w-md p-4 sm:p-6 border border-gray-200/50 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="relative">
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Envoyer un avertissement à {userToWarn.firstName}{" "}
                    {userToWarn.lastName}
                  </h3>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                  <p className="text-xs sm:text-sm text-yellow-800">
                    Boutique:{" "}
                    <span className="font-semibold">{userToWarn.shopName}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-yellow-800">
                    Email:{" "}
                    <span className="font-semibold">{userToWarn.email}</span>
                  </p>
                </div>
                <textarea
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  placeholder="Écrivez votre message d'avertissement ici..."
                  className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none shadow-inner"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowWarningModal(false)}
                    className="bg-gray-200 text-gray-800 px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={sendWarning}
                    className="bg-yellow-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Mail className="h-4 w-4" /> Envoyer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {selectedUser && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[90%] sm:max-w-lg p-4 sm:p-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors duration-200"
                >
                  ✕
                </button>
                <div className="flex flex-col items-center">
                  {selectedUser.image ? (
                    <Image
                      width={32}
                      height={32}
                      src={selectedUser.image}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg mb-4"
                    />
                  ) : (
                    <div
                      className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center border-4 border-gray-200 text-white text-2xl sm:text-4xl font-bold shadow-lg mb-4 ${
                        getInitialsAndColor(
                          selectedUser.firstName,
                          selectedUser.lastName,
                          selectedUser.id
                        ).color
                      }`}
                    >
                      {
                        getInitialsAndColor(
                          selectedUser.firstName,
                          selectedUser.lastName,
                          selectedUser.id
                        ).initials
                      }
                    </div>
                  )}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    {selectedUser.email}
                  </p>
                  <div className="w-full space-y-3">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-700 font-semibold text-xs sm:text-sm">
                        Date de création :
                      </span>
                      <span className="text-gray-900 text-xs sm:text-sm">
                        {selectedUser.createdAt}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-700 font-semibold text-xs sm:text-sm">
                        Téléphone :
                      </span>
                      <span className="text-gray-900 text-xs sm:text-sm">
                        {selectedUser.phone || "Non renseigné"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-700 font-semibold text-xs sm:text-sm">
                        Adresse :
                      </span>
                      <span className="text-gray-900 text-xs sm:text-sm">
                        {selectedUser.address
                          ? `${selectedUser.address.street}, ${selectedUser.address.province}, ${selectedUser.address.postalCode}`
                          : "Non renseignée"}
                      </span>
                    </div>
                    {"shopName" in selectedUser && (
                      <>
                        <div className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
                          <span className="text-purple-700 font-semibold text-xs sm:text-sm">
                            Nom de la boutique :
                          </span>
                          <span className="text-purple-900 font-bold text-xs sm:text-sm">
                            {selectedUser.shopName}
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg">
                          <span className="text-red-700 font-semibold text-xs sm:text-sm">
                            Signalements :
                          </span>
                          <span className="text-red-900 font-bold text-xs sm:text-sm">
                            {selectedUser.reportsCount || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-yellow-50 p-3 rounded-lg">
                          <span className="text-yellow-700 font-semibold text-xs sm:text-sm">
                            Note :
                          </span>
                          <span className="text-yellow-900 font-bold text-xs sm:text-sm">
                            {selectedUser.rating.toFixed(1)}
                          </span>
                        </div>
                      </>
                    )}
                    {"ordersCount" in selectedUser && (
                      <>
                        <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg">
                          <span className="text-emerald-700 font-semibold text-xs sm:text-sm">
                            Commandes :
                          </span>
                          <span className="text-emerald-900 font-bold text-xs sm:text-sm">
                            {selectedUser.ordersCount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-amber-50 p-3 rounded-lg">
                          <span className="text-amber-700 font-semibold text-xs sm:text-sm">
                            Total dépensé :
                          </span>
                          <span className="text-amber-900 font-bold text-xs sm:text-sm">
                            {selectedUser.totalSpent.toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Styles CSS */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          [data-animate] {
            animation: none !important;
            transition: none !important;
          }
        }
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1em;
          padding-right: 2rem;
        }
      `}</style>
    </div>
  );
}
