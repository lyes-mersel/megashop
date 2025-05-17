"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IoMdCheckmark } from "react-icons/io";
import { ColorFromAPI } from "@/lib/types/color.types";

const colors: ColorFromAPI[] = [
  { id: "1", nom: "Noir", code: "#000000" },
  { id: "2", nom: "Blanc", code: "#FFFFFF" },
  { id: "3", nom: "Rouge", code: "#FF0000" },
  { id: "4", nom: "Bleu", code: "#0000FF" },
  { id: "5", nom: "Vert", code: "#008000" },
  { id: "6", nom: "Jaune", code: "#FFFF00" },
  { id: "7", nom: "Orange", code: "#FFA500" },
  { id: "8", nom: "Rose", code: "#FFC0CB" },
  { id: "9", nom: "Gris", code: "#808080" },
  { id: "10", nom: "Marron", code: "#8B4513" },
  { id: "11", nom: "Violet", code: "#800080" },
  { id: "12", nom: "Beige", code: "#F5F5DC" },
];

interface ColorsSectionProps {
  selectedNom: string | null;
  onSelect: (nom: string | null) => void;
}

export default function ColorsSection({
  selectedNom,
  onSelect,
}: ColorsSectionProps) {
  const handleSelect = (nom: string) => {
    onSelect(selectedNom === nom ? null : nom); // Toggle selection
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-colors">
      <AccordionItem value="filter-colors" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Couleurs
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex space-2.5 flex-wrap md:grid grid-cols-5 gap-2.5">
            {colors.map((color) => (
              <button
                key={color.nom}
                type="button"
                style={{ backgroundColor: color.code }}
                className="rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center border border-black/20"
                onClick={() => handleSelect(color.nom)}
              >
                {selectedNom === color.nom && (
                  <IoMdCheckmark
                    className={`text-base ${
                      color.nom === "Noir" ? "text-white" : "text-black"
                    }`}
                  />
                )}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
