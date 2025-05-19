interface DeleteAllModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteAllModal({
  onConfirm,
  onCancel,
}: DeleteAllModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white/30 backdrop-blur-lg border border-gray-200/50 p-4 sm:p-6 rounded-xl shadow-2xl max-w-[90%] sm:max-w-sm w-full">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Confirmer la suppression
        </h3>
        <p className="text-black-600 mb-4 sm:mb-6 text-sm sm:text-base">
          Êtes-vous sûr de vouloir supprimer toutes les notifications ?
        </p>
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 text-sm sm:text-base"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
