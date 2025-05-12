import { ProductFromAPI } from "@/lib/types/product.types";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: ProductFromAPI[];
  onEdit: (product: ProductFromAPI) => void;
  onDelete: (product: ProductFromAPI) => void;
  onShowDetails: (product: ProductFromAPI) => void;
}

export const ProductList = ({
  products,
  onEdit,
  onDelete,
  onShowDetails,
}: ProductListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onShowDetails={onShowDetails}
          index={index}
        />
      ))}
    </div>
  );
};
