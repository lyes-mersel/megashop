"use client";

import Image from "next/image";

export default function EmptyState({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="text-center py-12">
      <Image
        width={100}
        height={100}
        src="/images/no-order.png"
        alt="Aucune commande"
        className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4"
        priority
      />
      <p className="text-lg sm:text-xl font-semibold text-gray-800">
        {title || "Aucune commande trouvée"}
      </p>
      <p className="text-gray-600 mt-2 text-sm sm:text-base">
        {description || "Aucun résultat ne correspond à votre recherche."}
      </p>
    </div>
  );
}
