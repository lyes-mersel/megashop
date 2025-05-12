import { ProductFromAPI } from "@/lib/types/product.types";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deletingProduct: ProductFromAPI;
  isDeleting: boolean;
}

export const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  deletingProduct,
  isDeleting,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Confirmer la suppression
        </h3>
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer {deletingProduct.nom} ?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`px-4 py-2 rounded-lg font-semibold ${
              isDeleting
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            } text-white`}
          >
            {isDeleting ? "Suppression..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
};
