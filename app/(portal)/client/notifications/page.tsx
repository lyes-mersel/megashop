"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { montserrat } from "@/styles/fonts";
import { fetchPaginatedDataFromAPI } from "@/lib/utils/fetchData";
import { NotificationFromAPI } from "@/lib/types/notification.types";
import { NotificationType } from "@prisma/client";
import NotificationList from "@/components/portal/client/notificationpage/NotificationList";
import NotificationFilters from "@/components/portal/client/notificationpage/NotificationFilters";
import NotificationActions from "@/components/portal/client/notificationpage/NotificationActions";
import DeleteAllModal from "@/components/portal/client/notificationpage/DeleteAllModal";
import Pagination from "@/components/portal/client/notificationpage/Pagination";
import { useSession } from "next-auth/react";

interface Filters {
  type: NotificationType | "";
  status: "lu" | "nonlu" | "";
  sortBy: "asc" | "desc" | "";
  page: number;
  pageSize: number;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationFromAPI[]>([]);
  const [filters, setFilters] = useState<Filters>({
    type: "",
    status: "",
    sortBy: "desc",
    page: 1,
    pageSize: 5,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: session, status } = useSession() as {
    data: { user: { id: string } } | null;
    status: "authenticated" | "loading" | "unauthenticated";
  };

  // Memoized fetchNotifications function
  const fetchNotifications = useCallback(async () => {
    if (status === "loading") return;
    const userId = session?.user.id;

    if (!userId) {
      setIsLoading(false);
      toast.error("Vous devez être connecté pour accéder à cette page.");
      console.log("No user ID found in session");
      return;
    }

    setIsLoading(true);
    const queryParams = new URLSearchParams({
      page: filters.page.toString(),
      pageSize: filters.pageSize.toString(),
      sortBy: "date",
      ...(filters.status && { statut: filters.status }),
      ...(filters.type && { type: filters.type }),
    });

    const url = `/api/users/${userId}/notifications?${queryParams}`;
    const result = await fetchPaginatedDataFromAPI<NotificationFromAPI[]>(url);

    if (result.data) {
      setNotifications(result.data.data);
      setTotalItems(result.data.pagination.totalItems);
      setTotalPages(result.data.pagination.totalPages);
    } else {
      toast.error(
        result.error || "Erreur lors du chargement des notifications"
      );
    }
    setIsLoading(false);
  }, [filters, session?.user.id, status]);

  // Memoized refetch function
  const refetchNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const userId = session?.user.id;
    if (!userId) {
      toast.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}/notifications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estLu: true }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, estLu: true }))
        );
        toast.success("Toutes les notifications ont été marquées comme lues !");
        refetchNotifications();
      } else {
        toast.error("Erreur lors de la mise à jour des notifications");
      }
    } catch {
      toast.error("Erreur réseau lors de la mise à jour");
    }
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    const userId = session?.user.id;
    if (!userId) {
      toast.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}/notifications`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotifications([]);
        setTotalItems(0);
        setTotalPages(1);
        setShowDeleteAllModal(false);
        toast.success("Toutes les notifications ont été supprimées !");
        refetchNotifications();
      } else {
        toast.error("Erreur lors de la suppression des notifications");
      }
    } catch {
      toast.error("Erreur réseau lors de la suppression");
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="min-h-[calc(100dvh-125px)] bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:pl-10 sm:pr-10 flex flex-col">
      <div className="lg:min-w-4xl xl:min-w-6xl max-w-7xl mx-auto flex flex-col flex-1">
        {/* Header */}
        <div className="mb-4 flex items-center gap-4">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 15, -15, 10, -10, 5, -5, 0] }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
          </motion.div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
          >
            Notifications
          </h1>
        </div>
        <p className="mb-6 text-base sm:text-lg text-gray-700">
          Suivez les dernières activités et mises à jour ici.
        </p>

        {/* Filters and Actions */}
        <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <NotificationFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <NotificationActions
            onMarkAllRead={markAllAsRead}
            onDeleteAll={() => setShowDeleteAllModal(true)}
          />
        </div>

        {/* Notification List */}
        <NotificationList
          notifications={notifications}
          isLoading={isLoading}
          refetch={refetchNotifications}
        />

        {/* Pagination */}
        {totalItems > 0 && (
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            pageSize={filters.pageSize}
          />
        )}

        {/* Delete All Modal */}
        {showDeleteAllModal && (
          <DeleteAllModal
            onConfirm={deleteAllNotifications}
            onCancel={() => setShowDeleteAllModal(false)}
          />
        )}
      </div>
    </div>
  );
}
