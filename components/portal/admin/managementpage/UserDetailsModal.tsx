import Image from "next/image";
import { motion } from "framer-motion";

// Utils & Types
import { getImageUrlFromPublicId } from "@/lib/utils";
import { ClientWithStats, VendorWithStats } from "@/lib/types/user.types";

interface UserDetailsModalProps {
  user: ClientWithStats | VendorWithStats;
  onClose: () => void;
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  const isClient = "stats" in user && "totalCommandes" in user.stats;

  return (
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
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors duration-200"
          >
            ✕
          </button>
          <div className="flex flex-col items-center">
            {user.imagePublicId ? (
              <Image
                src={getImageUrlFromPublicId(user.imagePublicId)}
                alt={`${user.prenom} ${user.nom}`}
                width={128}
                height={128}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg mb-4"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center border-4 border-gray-200 text-white text-2xl sm:text-4xl font-bold shadow-lg mb-4 bg-indigo-600">
                {user.prenom[0]}
                {user.nom[0]}
              </div>
            )}
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              {user.prenom} {user.nom}
            </h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              {user.email}
            </p>
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-700 font-semibold text-xs sm:text-sm">
                  Date d&apos;inscription :
                </span>
                <span className="text-gray-900 text-xs sm:text-sm">
                  {new Date(user.dateCreation).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-700 font-semibold text-xs sm:text-sm">
                  Téléphone :
                </span>
                <span className="text-gray-900 text-xs sm:text-sm">
                  {user.tel || "Non renseigné"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-700 font-semibold text-xs sm:text-sm">
                  Adresse :
                </span>
                <span className="text-gray-900 text-xs sm:text-sm">
                  {user.adresse
                    ? `${user.adresse.rue}, ${user.adresse.ville}`
                    : "Non renseignée"}
                </span>
              </div>
              {isClient ? (
                <>
                  <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg">
                    <span className="text-emerald-700 font-semibold text-xs sm:text-sm">
                      Commandes :
                    </span>
                    <span className="text-emerald-900 font-bold text-xs sm:text-sm">
                      {(user as ClientWithStats).stats.totalCommandes}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-amber-50 p-3 rounded-lg">
                    <span className="text-amber-700 font-semibold text-xs sm:text-sm">
                      Total dépensé :
                    </span>
                    <span className="text-amber-900 font-bold text-xs sm:text-sm">
                      {(user as ClientWithStats).stats.totalDepenses?.toFixed(
                        2
                      ) || "0.00"}{" "}
                      DZ
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
                    <span className="text-purple-700 font-semibold text-xs sm:text-sm">
                      Boutique :
                    </span>
                    <span className="text-purple-900 font-bold text-xs sm:text-sm">
                      {user.vendeur?.nomBoutique || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg">
                    <span className="text-emerald-700 font-semibold text-xs sm:text-sm">
                      Produits Vendus :
                    </span>
                    <span className="text-emerald-900 font-bold text-xs sm:text-sm">
                      {(user as VendorWithStats).stats.produitsVendus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-amber-50 p-3 rounded-lg">
                    <span className="text-amber-700 font-semibold text-xs sm:text-sm">
                      Total Ventes :
                    </span>
                    <span className="text-amber-900 font-bold text-xs sm:text-sm">
                      {(user as VendorWithStats).stats.totalVentes?.toFixed(
                        2
                      ) || "0.00"}{" "}
                      DZ
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
