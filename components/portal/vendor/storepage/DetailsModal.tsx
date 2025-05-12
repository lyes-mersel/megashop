import Image from "next/image";
import { ProductFromAPI } from "@/lib/types/product.types";
import { montserrat } from "@/styles/fonts";
import {
  Tag,
  Package,
  FileText,
  DollarSign,
  Box,
  Star,
  Calendar,
  Folder,
  User,
  Palette,
  Ruler,
  Truck,
} from "lucide-react";
import { getImageUrlFromPublicId } from "@/lib/utils";
import MDEditor from "@uiw/react-md-editor";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductFromAPI;
}

export const DetailsModal = ({
  isOpen,
  onClose,
  product,
}: DetailsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-200/50">
        {/* Header */}
        <div className="relative mb-6">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-lg font-bold"
          >
            ✕
          </button>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold text-gray-900 ${montserrat.className}`}
          >
            Détails du produit
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Images Section */}
          {product.images.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Tag className="h-5 w-5 text-gray-600" /> Images
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Image
                  src={getImageUrlFromPublicId(product.images[0].imagePublicId)}
                  alt={`Image principale de ${product.nom}`}
                  width={200}
                  height={200}
                  className="w-full sm:w-48 h-48 object-cover rounded-md shadow-md transition-transform duration-300 hover:scale-105"
                />
                {product.images.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {product.images.slice(1).map((img, index) => (
                      <Image
                        key={img.id}
                        src={getImageUrlFromPublicId(img.imagePublicId)}
                        alt={`Image supplémentaire ${index + 1} de ${
                          product.nom
                        }`}
                        width={60}
                        height={60}
                        className="w-16 h-16 object-cover rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* General Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-600" /> Informations
              générales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="h-4 w-4" /> Nom
                </label>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {product.nom}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Tag className="h-4 w-4" /> Type
                </label>
                <p className="mt-1 text-base text-gray-600 capitalize">
                  {product.type || "Non spécifié"}
                </p>
              </div>
              {product.objet && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="h-4 w-4" /> Objet
                  </label>
                  <p className="mt-1 text-base text-gray-600">
                    {product.objet}
                  </p>
                </div>
              )}
              {product.description && (
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="h-4 w-4" /> Description
                  </label>
                  <div
                    className="prose-lg bg-[#f9fafb] p-4 rounded-lg"
                    data-color-mode="light"
                  >
                    <MDEditor.Markdown source={product.description} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing and Stock Section */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-600" /> Prix et stock
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <DollarSign className="h-4 w-4" /> Prix
                </label>
                <p className="mt-1 text-base font-medium text-gray-900">
                  DA {product.prix.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Box className="h-4 w-4" /> Quantité en stock
                </label>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {product.qteStock}
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Star className="h-4 w-4" /> Note moyenne
                </label>
                <p className="mt-1 text-base text-gray-600">
                  {product.noteMoyenne.toFixed(1)} / 5 (
                  {product.totalEvaluations} évaluations)
                </p>
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" /> Dates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4" /> Date de création
                </label>
                <p className="mt-1 text-base text-gray-600">
                  {new Date(product.dateCreation).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4" /> Dernière modification
                </label>
                <p className="mt-1 text-base text-gray-600">
                  {new Date(product.dateModification).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Attributes Section */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Folder className="h-5 w-5 text-gray-600" /> Attributs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.categorie && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Folder className="h-4 w-4" /> Catégorie
                  </label>
                  <p className="mt-1 text-base text-gray-600">
                    {product.categorie.nom}
                  </p>
                </div>
              )}
              {product.genre && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User className="h-4 w-4" /> Genre
                  </label>
                  <p className="mt-1 text-base text-gray-600">
                    {product.genre.nom}
                  </p>
                </div>
              )}
              {product.couleurs.length > 0 && (
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Palette className="h-4 w-4" /> Couleurs disponibles
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.couleurs.map((color) => (
                      <span
                        key={color.id}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm shadow-md transition-transform duration-300 hover:scale-105 bg-gray-700 ${
                          color.code === "#FFFFFF" ? "text-black" : "text-white"
                        }`}
                        style={{ backgroundColor: color.code }}
                      >
                        {color.nom}
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color.code }}
                        ></span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.tailles.length > 0 && (
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Ruler className="h-4 w-4" /> Tailles disponibles
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.tailles.map((size) => (
                      <span
                        key={size.id}
                        className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm shadow-md transition-transform duration-300 hover:scale-105"
                      >
                        {size.nom}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vendor and Supplier Section */}
          {(product.vendeur || product.fournisseur) && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Truck className="h-5 w-5 text-gray-600" /> Fournisseur et
                vendeur
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.vendeur && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <User className="h-4 w-4" /> Vendeur
                    </label>
                    <div className="mt-1 text-base text-gray-600">
                      <p className="font-medium">
                        {product.vendeur.nomBoutique}
                      </p>
                      {product.vendeur.description && (
                        <p className="text-sm mt-1">
                          {product.vendeur.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {product.fournisseur && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Truck className="h-4 w-4" /> Fournisseur
                    </label>
                    <p className="mt-1 text-base text-gray-600">
                      {product.fournisseur.nom || "Non spécifié"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-8 py-3 rounded-lg font-semibold hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Fermer
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-slide-in,
          [data-animate] {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};
