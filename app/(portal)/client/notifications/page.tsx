"use client";

import { useState } from "react";
import { Bell, Check, Eye, Trash2, Clock, Package } from "lucide-react";
import { Montserrat } from "next/font/google";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

interface Notification {
  type: "Commande" | "Livraison";
  message: string;
  date: string;
  status: "Lu" | "Non lu";
  link?: string;
  clientName: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      type: "Commande",
      message: "Vous avez passé une commande (Commande #1234)",
      date: "2025-04-06",
      status: "Non lu",
      link: "/client/commandes",
      clientName: "Utilisateur",
    },
    {
      type: "Livraison",
      message: "La livraison de votre commande (Commande #1234) a été effectuée",
      date: "2025-04-07",
      status: "Non lu",
      link: "/client/livraisons",
      clientName: "Utilisateur",
    },
  ]);

  const [typeFilter, setTypeFilter] = useState<"Commande" | "Livraison" | "">("");
  const [dateSort, setDateSort] = useState<"asc" | "desc" | "">("");
  const [statusFilter, setStatusFilter] = useState<"Lu" | "Non lu" | "">("");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const getFilteredNotifications = () => {
    let filtered = [...notifications];

    if (typeFilter) {
      filtered = filtered.filter((notif) => notif.type === typeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((notif) => notif.status === statusFilter);
    }

    if (dateSort) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateSort === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      });
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  const markAsRead = (index: number) => {
    setNotifications((prev) =>
      prev.map((notif, i) =>
        i === index && notif.status === "Non lu" ? { ...notif, status: "Lu" } : notif
      )
    );
    toast.success("Notification marquée comme lue !");
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.status === "Non lu" ? { ...notif, status: "Lu" } : notif))
    );
    toast.success("Toutes les notifications ont été marquées comme lues !");
  };

  const deleteNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
    toast.success("Notification supprimée avec succès !");
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
    setShowDeleteAllModal(false);
    toast.success("Toutes les notifications ont été supprimées !");
  };

  const cancelDeleteAll = () => {
    setShowDeleteAllModal(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "Commande":
        return <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />;
      case "Livraison":
        return <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:pl-10 sm:pr-10 relative">
      <div className="max-w-7xl mx-auto transition-all duration-300">
        {/* Titre "Notifications" avec animation professionnelle de cloche */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 15, -15, 10, -10, 5, -5, 0] }}
              transition={{ duration: 1.2, ease: "easeInOut", repeat: 0 }}
            >
              <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
            </motion.div>
            <h1
              className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Notifications
            </h1>
          </div>
        </div>

        {/* Texte descriptif rapproché */}
        <p className="mb-6 text-base sm:text-lg text-gray-700">
          Suivez les dernières activités et mises à jour ici.
        </p>

        {/* Filtres (Type, Date, Statut) et Boutons (Supprimer tout, Tout marquer comme lu) */}
        <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          {/* Conteneur des filtres (à gauche) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Filtre Type */}
            <div className="relative w-full sm:w-32">
              <button
                onClick={() => setIsTypeOpen(!isTypeOpen)}
                className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
              >
                {typeFilter || "Type"}
              </button>
              {isTypeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => { setTypeFilter(""); setIsTypeOpen(false); }}
                    className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                  >
                    Type
                  </button>
                  <button
                    onClick={() => { setTypeFilter("Commande"); setIsTypeOpen(false); }}
                    className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                  >
                    Commande
                  </button>
                  <button
                    onClick={() => { setTypeFilter("Livraison"); setIsTypeOpen(false); }}
                    className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                  >
                    Livraison
                  </button>
                </motion.div>
              )}
            </div>

            {/* Filtre Date */}
            <div className="relative w-full sm:w-32">
              <button
                onClick={() => setIsDateOpen(!isDateOpen)}
                className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
              >
                {dateSort === "asc" ? "Plus ancien" : dateSort === "desc" ? "Plus récent" : "Date"}
              </button>
              {isDateOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => { setDateSort(""); setIsDateOpen(false); }}
                    className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                  >
                    Date
                  </button>
                  <button
                    onClick={() => { setDateSort("desc"); setIsDateOpen(false); }}
                    className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                  >
                    Plus récent
                  </button>
                  <button
                    onClick={() => { setDateSort("asc"); setIsDateOpen(false); }}
                    className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                  >
                    Plus ancien
                  </button>
                </motion.div>
              )}
            </div>

            {/* Filtre Statut */}
            <div className="relative w-full sm:w-32">
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="w-full px-4 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-100/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-800 text-sm hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
              >
                {statusFilter || "Statut"}
              </button>
              {isStatusOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => { setStatusFilter(""); setIsStatusOpen(false); }}
                    className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                  >
                    Statut
                  </button>
                  <button
                    onClick={() => { setStatusFilter("Lu"); setIsStatusOpen(false); }}
                    className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                  >
                    Lu
                  </button>
                  <button
                    onClick={() => { setStatusFilter("Non lu"); setIsStatusOpen(false); }}
                    className="w-full px-4 py-2 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                  >
                    Non lu
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Conteneur des boutons (à droite) */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => setShowDeleteAllModal(true)}
              className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition-all duration-300 shadow-md font-bold text-sm sm:text-base"
            >
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Supprimer tout
            </button>
            <button
              onClick={markAllAsRead}
              className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300 shadow-md font-bold text-sm sm:text-base"
            >
              <Check className="h-4 w-4 sm:h-5 sm:w-5" />
              Tout marquer comme lu
            </button>
          </div>
        </div>

        {/* Liste des notifications */}
        <div className="space-y-6 relative">
          {filteredNotifications.map((notif, index) => (
            <motion.div
              key={index}
              className={`relative p-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden w-full ${
                notif.status === "Non lu" ? "bg-blue-50" : "bg-white"
              }`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            >
              {/* Barre latérale colorée selon le type */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                notif.type === "Commande" ? "bg-blue-500" : "bg-green-600"
              }`}></div>
              
              <div className="p-4 sm:p-6 sm:pl-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getNotificationIcon(notif.type)}
                      <span className={`font-semibold text-base sm:text-lg ${
                        notif.type === "Commande" ? "text-blue-700" : "text-green-700"
                      }`}>
                        {notif.type}
                      </span>
                      <span
                        className={`ml-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          notif.status === "Lu" 
                          ? "bg-gray-100 text-gray-600 border border-gray-200" 
                          : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        {notif.status}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base font-medium">{notif.message}</p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" /> {notif.date}
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Afficher le bouton "Voir" uniquement pour les notifications de type "Commande" */}
                      {notif.type === "Commande" && (
                        <Link href={`${notif.link}?search=${encodeURIComponent(notif.clientName)}`}>
                          <span className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300 cursor-pointer text-sm sm:text-base">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="font-medium">Voir</span>
                          </span>
                        </Link>
                      )}
                      <button
                        onClick={() => deleteNotification(index)}
                        className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-300 text-sm sm:text-base"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="font-medium">Supprimer</span>
                      </button>
                    </div>
                    {notif.status === "Non lu" && (
                      <button
                        onClick={() => markAsRead(index)}
                        className="w-full sm:w-auto bg-black text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md text-sm sm:text-base font-medium flex items-center gap-2"
                      >
                        <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message si aucune notification */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-gray-400" />
            <p className="text-xl sm:text-2xl font-semibold text-gray-800 mt-4">
              Aucune notification trouvée
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Aucun résultat ne correspond à vos filtres.
            </p>
          </div>
        )}
      </div>

      {/* Modale de confirmation pour supprimer toutes les notifications */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white/30 backdrop-blur-lg border border-gray-200/50 p-4 sm:p-6 rounded-xl shadow-2xl max-w-[90%] sm:max-w-sm w-full">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-black-600 mb-4 sm:mb-6 text-sm sm:text-base">Êtes-vous sûr de vouloir supprimer toutes les notifications ?</p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={cancelDeleteAll}
                className="w-full sm:w-auto bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
              >
                Annuler
              </button>
              <button
                onClick={deleteAllNotifications}
                className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 text-sm sm:text-base"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}