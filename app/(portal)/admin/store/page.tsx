"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

// Components
import { StoreHeader } from "@/components/portal/admin/storepage/StoreHeader";
import { ProductList } from "@/components/portal/admin/storepage/ProductList";
import { Pagination } from "@/components/portal/admin/storepage/Pagination";
import { ProductForm } from "@/components/portal/admin/storepage/ProductForm";
import { DeleteModal } from "@/components/portal/admin/storepage/DeleteModal";
import { DetailsModal } from "@/components/portal/admin/storepage/DetailsModal";

// Hooks
import { useAdminStoreData } from "@/hooks/useAdminStoreData";

// Types
import { ProductFromAPI } from "@/lib/types/product.types";
import IsLoading from "@/components/portal/IsLoading";
import Error from "@/components/portal/Error";
import { fetchDataFromAPI } from "@/lib/utils/fetchData";

export default function ShopPage() {
  const {
    categories,
    colors,
    genders,
    sizes,
    products,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    pagination,
    setPagination,
    setRefresh,
  } = useAdminStoreData();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFromAPI | null>(
    null
  );
  const [deletingProduct, setDeletingProduct] = useState<ProductFromAPI | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<ProductFromAPI | null>(
    null
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: ProductFromAPI) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (product: ProductFromAPI) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletingProduct) {
      setIsDeleting(true);
      const result = await fetchDataFromAPI<null>(
        `/api/products/${deletingProduct.id}`,
        {
          method: "DELETE",
        }
      );

      if (result.error) {
        toast.error(
          result.error || "Erreur lors de la suppression du produit !"
        );
      } else {
        toast.success(result.message || "Produit supprimé avec succès !");
      }
      setShowDeleteModal(false);
      setDeletingProduct(null);
      setIsDeleting(false);
      setRefresh((prev) => !prev);
    }
  };

  const handleShowDetails = (product: ProductFromAPI) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  if (isLoading) return <IsLoading />;
  if (error) return <Error />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <StoreHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddProduct={handleAddProduct}
        />

        {products.length > 0 ? (
          <>
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onShowDetails={handleShowDetails}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Image
              width={100}
              height={100}
              src="/images/not-found.png"
              alt="Produit non trouvé"
              className="mx-auto w-32 h-32 mb-4"
            />
            <p className="text-xl font-semibold text-gray-800">
              Pas de produits trouvés
            </p>
            <p className="text-base text-gray-600 mt-2">
              Aucun produit ne correspond à votre recherche.
            </p>
          </div>
        )}

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => {
            setPagination((prev) => ({
              ...prev,
              currentPage: page,
            }));
          }}
        />

        <ProductForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={() => {
            setIsFormOpen(false);
            setRefresh((prev) => !prev);
          }}
          editingProduct={editingProduct}
          categories={categories}
          genders={genders}
          colors={colors}
          sizes={sizes}
        />

        {deletingProduct && (
          <DeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            deletingProduct={deletingProduct}
            isDeleting={isDeleting}
          />
        )}

        <DetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          product={selectedProduct!}
        />
      </div>
    </div>
  );
}
