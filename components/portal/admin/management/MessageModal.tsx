import { useState } from "react";
import { ClientWithStats, VendorWithStats } from "@/lib/types/user.types";
import { motion } from "framer-motion";
import { X, Mail } from "lucide-react";

interface MessageModalProps {
  user: ClientWithStats | VendorWithStats;
  onClose: () => void;
  onSend: (userId: string, message: string) => void;
}

export function MessageModal({ user, onClose, onSend }: MessageModalProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(user.id, message);
    onClose();
  };

  return (
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
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Message à {user.prenom} {user.nom}
            </h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-xs sm:text-sm text-blue-800">
              Email: <span className="font-semibold">{user.email}</span>
            </p>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez votre message ici..."
            className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none shadow-inner"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
            >
              Annuler
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="h-4 w-4" /> Envoyer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
