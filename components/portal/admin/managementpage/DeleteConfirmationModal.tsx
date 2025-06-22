interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white/30 backdrop-blur-lg border border-gray-200/50 p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[90%] sm:max-w-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Confirmer la suppression
        </h3>
        <p className="text-black-600 mb-6 text-sm sm:text-base">
          Êtes-vous sûr de vouloir supprimer cet utilisateur ?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 text-sm sm:text-base"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
