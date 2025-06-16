interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full">
        <p className="text-lg font-semibold">
          Êtes-vous sûr de vouloir supprimer cet utilisateur ?
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Confirmer
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
