import { MessageSquare, Trash2 } from "lucide-react";

// Types
import {
  ClientWithStats,
  VendorWithStats,
  UserType,
  SortConfig,
  SortField,
} from "@/lib/types/user.types";

interface UserTableProps {
  users: ClientWithStats[] | VendorWithStats[];
  userType: UserType;
  sortConfig: SortConfig | null;
  onSort: (config: SortConfig) => void;
  onDelete: (id: string, type: UserType) => void;
  onMessage: (user: ClientWithStats | VendorWithStats) => void;
  onSelectUser: (user: ClientWithStats | VendorWithStats) => void;
  loading: boolean;
}

export function UserTable({
  users,
  userType,
  sortConfig,
  onSort,
  onDelete,
  onMessage,
  onSelectUser,
  loading,
}: UserTableProps) {
  if (loading) return <div className="text-center py-4">Chargement...</div>;
  if (!users.length)
    return <div className="text-center py-4">Aucun utilisateur trouvé</div>;

  const headers =
    userType === "CLIENT"
      ? [
          "Utilisateur",
          "Date d'inscription",
          "Nombre de commandes",
          "Total dépensé",
          "Actions",
        ]
      : [
          "Utilisateur",
          "Date d'inscription",
          "Boutique",
          "Produits Vendus",
          "Total Ventes",
          "Actions",
        ];

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6">
      {/* Table for desktop */}
      <table className="hidden sm:table w-full">
        <thead>
          <tr className="border-b">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="py-3 px-4 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                onClick={() =>
                  header !== "Actions" &&
                  onSort({
                    key: header.toLowerCase().replace(" ", "") as SortField,
                    direction: sortConfig?.direction === "asc" ? "desc" : "asc",
                  })
                }
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectUser(user)}
            >
              <td className="py-3 px-4">
                {user.prenom} {user.nom}
              </td>
              <td className="py-3 px-4">
                {new Date(user.dateCreation).toLocaleDateString()}
              </td>
              {userType === "CLIENT" ? (
                <>
                  <td className="py-3 px-4">
                    {(user as ClientWithStats).stats.totalCommandes}
                  </td>
                  <td className="py-3 px-4">
                    {(user as ClientWithStats).stats.totalDepenses?.toFixed(2) || "0.00"} DZ
                  </td>
                </>
              ) : (
                <>
                  <td className="py-3 px-4">
                    {user.vendeur?.nomBoutique || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    {(user as VendorWithStats).stats.produitsVendus}
                  </td>
                  <td className="py-3 px-4">
                    {(user as VendorWithStats).stats.totalVentes?.toFixed(2) || "0.00"} DZ
                  </td>
                </>
              )}
              <td className="py-3 px-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMessage(user);
                  }}
                  className="p-2 text-gray-600 hover:text-indigo-600"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(user.id, userType);
                  }}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Cards for mobile */}
      <div className="sm:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 border rounded-lg"
            onClick={() => onSelectUser(user)}
          >
            <p>
              <strong>
                {user.prenom} {user.nom}
              </strong>
            </p>
            <p>Date: {new Date(user.dateCreation).toLocaleDateString()}</p>
            {userType === "CLIENT" ? (
              <>
                <p>
                  Commandes: {(user as ClientWithStats).stats.totalCommandes}
                </p>
                <p>
                  Dépensé:{" "}
                  {(user as ClientWithStats).stats.totalDepenses?.toFixed(2) || "0.00"} DZ
                </p>
              </>
            ) : (
              <>
                <p>Boutique: {user.vendeur?.nomBoutique || "N/A"}</p>
                <p>
                  Produits Vendus:{" "}
                  {(user as VendorWithStats).stats.produitsVendus}
                </p>
                <p>
                  Ventes:{" "}
                  {(user as VendorWithStats).stats.totalVentes?.toFixed(2) || "0.00"} DZ
                </p>
              </>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMessage(user);
                }}
                className="p-2 text-gray-600 hover:text-indigo-600"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(user.id, userType);
                }}
                className="p-2 text-gray-600 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
