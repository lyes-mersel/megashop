"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MdKeyboardArrowRight } from "react-icons/md";

type Gender = {
  nom: string;
  description: string;
};

const gendersData: Gender[] = [
  {
    nom: "Homme",
    description: "Vêtements et accessoires conçus pour hommes.",
  },
  {
    nom: "Femme",
    description: "Vêtements et accessoires conçus pour femmes.",
  },
  {
    nom: "Enfant",
    description: "Vêtements et accessoires pour enfants et adolescents.",
  },
  {
    nom: "Unisexe",
    description: "Vêtements et accessoires adaptés à tous les genres.",
  },
];

interface GendersSectionProps {
  selectedNom: string | null;
  onSelect: (nom: string | null) => void;
}

export default function GendersSection({
  selectedNom,
  onSelect,
}: GendersSectionProps) {
  const handleSelect = (nom: string) => {
    onSelect(selectedNom === nom ? null : nom); // Toggle selection
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-genders">
      <AccordionItem value="filter-genders" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Genre
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0 overflow-visible">
          <div className="flex flex-col space-y-1 text-black/80">
            {gendersData.map((gender) => (
              <div className="relative group" key={gender.nom}>
                <button
                  onClick={() => handleSelect(gender.nom)}
                  className={`flex items-center justify-between w-full py-2 px-3 rounded-lg transition ${
                    selectedNom === gender.nom
                      ? "bg-black text-white"
                      : "hover:bg-black/10"
                  }`}
                >
                  {gender.nom} <MdKeyboardArrowRight />
                </button>
                <div className="absolute z-10 hidden group-hover:block w-64 bg-white border border-gray-200 shadow-md text-sm text-gray-700 p-2 rounded-md top-full mt-1 left-0">
                  {gender.description}
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
