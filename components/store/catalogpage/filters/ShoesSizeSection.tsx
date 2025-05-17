"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { SizeFromAPI } from "@/lib/types/size.types";

const sizes: SizeFromAPI[] = [
  { id: "13", nom: "27" },
  { id: "14", nom: "28" },
  { id: "15", nom: "29" },
  { id: "16", nom: "30" },
  { id: "17", nom: "31" },
  { id: "18", nom: "32" },
  { id: "19", nom: "33" },
  { id: "20", nom: "34" },
  { id: "21", nom: "35" },
  { id: "22", nom: "36" },
  { id: "23", nom: "37" },
  { id: "24", nom: "38" },
  { id: "25", nom: "39" },
  { id: "26", nom: "40" },
  { id: "27", nom: "41" },
  { id: "28", nom: "42" },
  { id: "29", nom: "43" },
  { id: "30", nom: "44" },
];

interface ShoesSizeSectionProps {
  selectedNom: string | null;
  onSelect: (nom: string | null) => void;
}

export default function ShoesSizeSection({
  selectedNom,
  onSelect,
}: ShoesSizeSectionProps) {
  const handleSelect = (nom: string) => {
    onSelect(selectedNom === nom ? null : nom); // Toggle selection
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-size">
      <AccordionItem value="filter-size" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Tailles chaussures
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex items-center flex-wrap">
            {sizes.map((size) => (
              <button
                key={size.nom}
                type="button"
                className={cn([
                  "bg-[#F0F0F0] m-1 flex items-center justify-center px-5 py-2.5 text-sm rounded-full max-h-[39px]",
                  selectedNom === size.nom && "bg-black font-medium text-white",
                ])}
                onClick={() => handleSelect(size.nom)}
              >
                {size.nom}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
