import Image from "next/image";

const EmptyState = () => (
  <div className="text-center py-12">
    <Image
      width={100}
      height={100}
      src="/images/not-found.png"
      alt="Aucun signalement"
      className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4"
    />
    <p className="text-lg sm:text-xl font-semibold text-gray-800">
      Aucun signalement trouvé
    </p>
    <p className="text-gray-600 mt-2 text-sm sm:text-base">
      Aucun résultat ne correspond à votre recherche ou filtres.
    </p>
  </div>
);

export default EmptyState;