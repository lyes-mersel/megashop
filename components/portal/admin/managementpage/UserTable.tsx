import { MessageSquare, Trash2, Store } from "lucide-react";
import Image from "next/image";

// Types
import {
  ClientWithStats,
  VendorWithStats,
  UserType,
} from "@/lib/types/user.types";
import { extractDateString, getImageUrlFromPublicId } from "@/lib/utils";

// Helper function to get initials and color
function getInitialsAndColor(firstName: string, lastName: string, id: string) {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
  ];
  const colorIndex =
    id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return { initials, color: colors[colorIndex] };
}

interface UserTableProps {
  users: ClientWithStats[] | VendorWithStats[];
  userType: UserType;
  onDelete: (id: string, type: UserType) => void;
  onMessage: (user: ClientWithStats | VendorWithStats) => void;
  onSelectUser: (user: ClientWithStats | VendorWithStats) => void;
  loading: boolean;
}

export function UserTable({
  users,
  userType,
  onDelete,
  onMessage,
  onSelectUser,
  loading,
}: UserTableProps) {
  if (loading) return <div className="text-center py-4">Chargement...</div>;
  if (!users.length)
    return <div className="text-center py-4">Aucun utilisateur trouvé</div>;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
      {/* Table for desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Date d&apos;inscription
              </th>
              {userType === "CLIENT" ? (
                <>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Commandes
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Total dépensé (DZ)
                  </th>
                </>
              ) : (
                <>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Boutique
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Produits Vendus
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Total Ventes (DZ)
                  </th>
                </>
              )}
              <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onSelectUser(user)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {user.imagePublicId ? (
                      <Image
                        width={32}
                        height={32}
                        src={getImageUrlFromPublicId(user.imagePublicId)}
                        alt={`${user.prenom} ${user.nom}`}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          getInitialsAndColor(user.prenom, user.nom, user.id)
                            .color
                        }`}
                      >
                        {
                          getInitialsAndColor(user.prenom, user.nom, user.id)
                            .initials
                        }
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {user.prenom} {user.nom}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                  <div className="text-xs sm:text-sm text-gray-600">
                    {extractDateString(user.dateCreation)}
                  </div>
                </td>
                {userType === "CLIENT" ? (
                  <>
                    <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-xs sm:text-sm font-medium text-gray-900">
                        {(user as ClientWithStats).stats.totalCommandes}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap hidden xl:table-cell">
                      <div className="text-xs sm:text-sm font-medium text-gray-900">
                        {(user as ClientWithStats).stats.totalDepenses?.toFixed(
                          2
                        ) || "0.00"}
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-xs sm:text-sm font-medium text-gray-800">
                        {user.vendeur?.nomBoutique || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap hidden xl:table-cell">
                      <div className="text-xs sm:text-sm font-medium text-gray-900">
                        {(user as VendorWithStats).stats.produitsVendus}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap hidden xl:table-cell">
                      <div className="text-xs sm:text-sm font-medium text-gray-900">
                        {(user as VendorWithStats).stats.totalVentes?.toFixed(
                          2
                        ) || "0.00"}
                      </div>
                    </td>
                  </>
                )}
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMessage(user);
                      }}
                      className="bg-indigo-500 text-white p-2 sm:px-3 sm:py-1 rounded-md hover:bg-indigo-600 transition-all duration-200 shadow-sm"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(user.id, userType);
                      }}
                      className="bg-red-500 text-white p-2 sm:px-3 sm:py-1 rounded-md hover:bg-red-600 transition-all duration-200 shadow-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Cards for mobile */}
      <div className="sm:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border-b border-gray-200 p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onSelectUser(user)}
          >
            <div className="flex items-center gap-3 mb-2">
              {user.imagePublicId ? (
                <Image
                  width={32}
                  height={32}
                  src={getImageUrlFromPublicId(user.imagePublicId)}
                  alt={`${user.prenom} ${user.nom}`}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    getInitialsAndColor(user.prenom, user.nom, user.id).color
                  }`}
                >
                  {getInitialsAndColor(user.prenom, user.nom, user.id).initials}
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {user.prenom} {user.nom}
                </div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-1">
              Date d&apos;inscription: {extractDateString(user.dateCreation)}
            </div>
            {userType === "CLIENT" ? (
              <>
                <div className="text-xs text-gray-600 mb-1">
                  Commandes: {(user as ClientWithStats).stats.totalCommandes}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  Total dépensé:{" "}
                  {(user as ClientWithStats).stats.totalDepenses?.toFixed(2) ||
                    "0.00"}{" "}
                  DZ
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Store className="h-3 w-3 text-indigo-600" />
                  <span>{user.vendeur?.nomBoutique || "N/A"}</span>
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  Produits Vendus:{" "}
                  {(user as VendorWithStats).stats.produitsVendus}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  Total Ventes:{" "}
                  {(user as VendorWithStats).stats.totalVentes?.toFixed(2) ||
                    "0.00"}{" "}
                  DZ
                </div>
              </>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMessage(user);
                }}
                className="bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition-all duration-200 shadow-sm"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(user.id, userType);
                }}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-all duration-200 shadow-sm"
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
