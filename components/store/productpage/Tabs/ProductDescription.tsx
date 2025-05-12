import MDEditor from "@uiw/react-md-editor";
import React from "react";

const ProductDescription = ({
  description,
}: {
  description?: string | null;
}) => {
  const safeDescription =
    description ?? "Aucune description disponible pour ce produit.";

  return (
    <section>
      <h3 className="text-xl sm:text-2xl font-bold text-black mb-5 sm:mb-6">
        Description du produit
      </h3>
      <div className="prose-lg" data-color-mode="light">
        <MDEditor.Markdown source={safeDescription} />
      </div>
    </section>
  );
};

export default ProductDescription;
