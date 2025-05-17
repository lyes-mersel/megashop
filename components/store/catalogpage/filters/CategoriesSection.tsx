"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MdKeyboardArrowRight } from "react-icons/md";

type Category = {
  nom: string;
  description: string;
};

const categoriesData: Category[] = [
  {
    nom: "Hauts",
    description:
      "T-shirts, chemises, pulls et autres vêtements pour le haut du corps.",
  },
  {
    nom: "Bas",
    description:
      "Pantalons, jeans, shorts et autres vêtements pour le bas du corps.",
  },
  {
    nom: "Robes & Ensembles",
    description: "Robes et ensembles assortis pour toutes occasions.",
  },
  {
    nom: "Vestes & Manteaux",
    description: "Vestes légères, manteaux d'hiver et blousons.",
  },
  {
    nom: "Chaussures",
    description: "Baskets, bottes, sandales et autres types de chaussures.",
  },
  {
    nom: "Accessoires",
    description: "Sacs, écharpes, ceintures et autres compléments de tenue.",
  },
  {
    nom: "Autres",
    description: "Articles divers ne rentrant pas dans les autres catégories.",
  },
];

interface CategoriesSectionProps {
  selectedNom: string | null;
  onSelect: (nom: string | null) => void;
}

export default function CategoriesSection({
  selectedNom,
  onSelect,
}: CategoriesSectionProps) {
  const handleSelect = (nom: string) => {
    onSelect(selectedNom === nom ? null : nom); // Toggle selection
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-categories">
      <AccordionItem value="filter-categories" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Catégories
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-col space-y-1 text-black/80">
            {categoriesData.map((category) => (
              <div className="relative group" key={category.nom}>
                <button
                  onClick={() => handleSelect(category.nom)}
                  className={`flex items-center justify-between w-full py-2 px-3 rounded-lg transition ${
                    selectedNom === category.nom
                      ? "bg-black text-white"
                      : "hover:bg-black/10"
                  }`}
                >
                  {category.nom} <MdKeyboardArrowRight />
                </button>
                <div className="absolute z-10 hidden group-hover:block w-64 bg-white border border-gray-200 shadow-md text-sm text-gray-700 p-2 rounded-md top-full mt-1 left-0">
                  {category.description}
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
