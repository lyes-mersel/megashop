import { Bell } from "lucide-react";
import { NotificationFromAPI } from "@/lib/types/notification.types";
import NotificationCard from "./NotificationCard";

interface NotificationListProps {
  notifications: NotificationFromAPI[];
  isLoading: boolean;
  refetch: () => void;
}

export default function NotificationList({
  notifications,
  isLoading,
  refetch,
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-center py-12">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-800 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <span className="sr-only">Chargement...</span>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-gray-400" />
        <p className="text-xl sm:text-2xl font-semibold text-gray-800 mt-4">
          Aucune notification trouvée
        </p>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Aucun résultat ne correspond à vos filtres.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notifications.map((notification, index) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          index={index}
          refetch={refetch}
        />
      ))}
    </div>
  );
}
