import { useState } from "react";
import { ClientWithStats, VendorWithStats } from "@/lib/types/user.types";

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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold">
          Message à {user.prenom} {user.nom}
        </h3>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mt-2 p-2 border rounded-lg"
          placeholder="Écrire un message..."
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            disabled={!message.trim()}
          >
            Envoyer
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
