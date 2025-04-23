"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MdKeyboardArrowRight } from "react-icons/md";

type Category = {
  id: string;
  title: string;
  description: string;
};

const categoriesData: Category[] = [
  {
    id: "cm9smmidy00033ok17udh743s",
    title: "Hauts",
    description:
      "T-shirts, chemises, pulls et autres vêtements pour le haut du corps.",
  },
  {
    id: "cm9smmidy00043ok1uevrt2rz",
    title: "Bas",
    description:
      "Pantalons, jeans, shorts et autres vêtements pour le bas du corps.",
  },
  {
    id: "cm9smmidy00053ok1hxi2g3pp",
    title: "Robes & Ensembles",
    description: "Robes et ensembles assortis pour toutes occasions.",
  },
  {
    id: "cm9smmidy00063ok1xrgatqot",
    title: "Vestes & Manteaux",
    description: "Vestes légères, manteaux d'hiver et blousons.",
  },
  {
    id: "cm9smmidy00073ok176su4rpn",
    title: "Chaussures",
    description: "Baskets, bottes, sandales et autres types de chaussures.",
  },
  {
    id: "cm9smmidy00083ok1ferps6xm",
    title: "Accessoires",
    description: "Sacs, écharpes, ceintures et autres compléments de tenue.",
  },
  {
    id: "cm9smmidy00093ok1i5wz60uh",
    title: "Autres",
    description: "Articles divers ne rentrant pas dans les autres catégories.",
  },
];

type Props = {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

const CategoriesSection = ({ selectedId, onSelect }: Props) => {
  const handleSelect = (id: string) => {
    onSelect(selectedId === id ? null : id); // toggle
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
              <div className="relative group" key={category.id}>
                <button
                  onClick={() => handleSelect(category.id)}
                  className={`flex items-center justify-between w-full py-2 px-3 rounded-lg transition ${
                    selectedId === category.id
                      ? "bg-black text-white"
                      : "hover:bg-black/10"
                  }`}
                >
                  {category.title} <MdKeyboardArrowRight />
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
};

export default CategoriesSection;
