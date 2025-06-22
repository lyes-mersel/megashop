import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { CommandeStatut } from "@prisma/client";
import { JSX } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  orderId: string | null;
  newStatus: CommandeStatut | null;
  isUpdating: boolean;
  statusLabels: Record<CommandeStatut, string>;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  orderId,
  newStatus,
  isUpdating,
  statusLabels,
  onConfirm,
  onCancel,
}: ConfirmationModalProps): JSX.Element {
  return (
    <AnimatePresence>
      {isOpen && orderId && newStatus && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="bg-white/95 backdrop-blur-md rounded-xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmer le changement de statut
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Voulez-vous vraiment changer le statut de la commande #{orderId} à{" "}
              <span className="font-semibold">{statusLabels[newStatus]}</span> ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
                disabled={isUpdating}
              >
                Annuler
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
                Confirmer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
