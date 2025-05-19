import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, Eye, Package, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { NotificationFromAPI } from "@/lib/types/notification.types";
import { NotificationType } from "@prisma/client";
import { useSession } from "next-auth/react";

interface NotificationCardProps {
  notification: NotificationFromAPI;
  index: number;
  refetch: () => void;
}

export default function NotificationCard({
  notification,
  index,
  refetch,
}: NotificationCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session, status } = useSession();

  const markAsRead = async () => {
    if (status === "loading") return;
    const userId = session?.user.id;

    try {
      const response = await fetch(
        `/api/users/${userId}/notifications/${notification.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estLu: true }),
        }
      );

      if (response.ok) {
        toast.success("Notification marquée comme lue !");
        refetch(); // Trigger refetch after successful update
      } else {
        toast.error("Erreur lors de la mise à jour de la notification");
      }
    } catch {
      toast.error("Erreur réseau lors de la mise à jour");
    }
  };

  const deleteNotification = async () => {
    if (status === "loading") return;
    const userId = session?.user.id;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/users/${userId}/notifications/${notification.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Notification supprimée avec succès !");
        refetch(); // Trigger refetch after successful deletion
      } else {
        toast.error("Erreur lors de la suppression de la notification");
      }
    } catch {
      toast.error("Erreur réseau lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.COMMANDE:
        return <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />;
      case NotificationType.LIVRAISON:
        return <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />;
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.COMMANDE:
        return "text-blue-700 bg-blue-500";
      case NotificationType.LIVRAISON:
        return "text-green-700 bg-green-600";
      default:
        return "text-gray-700 bg-gray-600";
    }
  };

  return (
    <motion.div
      className={`relative p-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden w-full ${
        notification.estLu ? "bg-white" : "bg-blue-50"
      }`}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          getTypeColor(notification.type).split(" ")[1]
        }`}
      ></div>
      <div className="p-4 sm:p-6 sm:pl-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {getNotificationIcon(notification.type)}
              <span
                className={`font-semibold text-base sm:text-lg ${
                  getTypeColor(notification.type).split(" ")[0]
                }`}
              >
                {notification.type}
              </span>
              <span
                className={`ml-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                  notification.estLu
                    ? "bg-gray-100 text-gray-600 border border-gray-200"
                    : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                }`}
              >
                {notification.estLu ? "Lu" : "Non lu"}
              </span>
            </div>
            <p className="text-gray-900 text-base sm:text-lg font-semibold mb-1">
              {notification.objet}
            </p>
            <p className="text-gray-700 text-sm sm:text-base font-medium">
              {notification.text}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              {new Date(notification.date).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              {notification.urlRedirection && (
                <Link href={notification.urlRedirection}>
                  <span className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300 cursor-pointer text-sm sm:text-base">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="font-medium">Voir</span>
                  </span>
                </Link>
              )}
              <button
                onClick={deleteNotification}
                disabled={isDeleting}
                className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-300 text-sm sm:text-base disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="font-medium">Supprimer</span>
              </button>
            </div>
            {!notification.estLu && (
              <button
                onClick={markAsRead}
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
  );
}
