import { Check, Trash2 } from "lucide-react";

interface NotificationActionsProps {
  onMarkAllRead: () => void;
  onDeleteAll: () => void;
}

export default function NotificationActions({
  onMarkAllRead,
  onDeleteAll,
}: NotificationActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
      <button
        onClick={onDeleteAll}
        className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition-all duration-300 shadow-md font-bold text-sm sm:text-base"
      >
        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
        Supprimer tout
      </button>
      <button
        onClick={onMarkAllRead}
        className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300 shadow-md font-bold text-sm sm:text-base"
      >
        <Check className="h-4 w-4 sm:h-5 sm:w-5" />
        Tout marquer comme lu
      </button>
    </div>
  );
}
