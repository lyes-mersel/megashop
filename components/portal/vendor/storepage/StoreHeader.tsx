import { Plus, Store } from "lucide-react";
import { montserrat } from "@/styles/fonts";
import Image from "next/image";
import { useState } from "react";

interface StoreHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddProduct: () => void;
}

export const StoreHeader = ({
  searchQuery,
  setSearchQuery,
  onAddProduct,
}: StoreHeaderProps) => {
  const [searchField, setSearchField] = useState(searchQuery);

  return (
    <div className="relative mb-10 bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-6 min-h-[220px]">
      <div>
        <div className="mb-4 flex items-center gap-2 sm:gap-3">
          <Store className="h-6 w-6 sm:h-8 sm:w-8" />
          <h1 className={`text-2xl font-semibold ${montserrat.className}`}>
            Boutique
          </h1>
        </div>
        <p className="mt-2 text-lg">
          Bienvenue dans votre espace de gestion de produits. <br />
        </p>
        <button
          onClick={onAddProduct}
          className="mt-4 bg-white text-black px-6 py-3 rounded-lg flex items-center gap-2 font-semibold hover:bg-gray-200 transition-all duration-300 shadow-lg"
        >
          <Plus className="h-5 w-5" /> Ajouter un produit
        </button>
      </div>
      <div className="w-40 h-40 p-4 border-4 rounded-full border-white shadow-lg">
        <Image
          width={100}
          height={100}
          src="/images/store.png"
          alt="Store Icon"
          className="w-full h-full object-cover mt-1"
        />
      </div>

      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            setSearchQuery(searchField); // Use the state value directly
          }}
        >
          <input
            type="text"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            placeholder="Rechercher un produit par nom..."
            className="w-full px-4 py-3 bg-white/30 backdrop-blur-lg border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 text-black placeholder-black shadow-md"
          />

          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
            aria-label="Rechercher"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
