import React from "react";
import ReactMarkdown from "react-markdown";

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
      <div className="prose prose-lg">
        <ReactMarkdown>{safeDescription}</ReactMarkdown>
      </div>
    </section>
  );
};

export default ProductDescription;
