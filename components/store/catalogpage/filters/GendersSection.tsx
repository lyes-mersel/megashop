"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MdKeyboardArrowRight } from "react-icons/md";

type Gender = {
  id: string;
  title: string;
  description: string;
};

const gendersData: Gender[] = [
  {
    id: "cm9smmimu000a3ok16up8s1q5",
    title: "Homme",
    description: "Vêtements et accessoires conçus pour hommes.",
  },
  {
    id: "cm9smmimu000b3ok1fy5jvqmw",
    title: "Femme",
    description: "Vêtements et accessoires conçus pour femmes.",
  },
  {
    id: "cm9smmimu000c3ok13qwaoxi0",
    title: "Enfant",
    description: "Vêtements et accessoires pour enfants et adolescents.",
  },
  {
    id: "cm9smmimu000d3ok1inkfsgq3",
    title: "Unisexe",
    description: "Vêtements et accessoires adaptés à tous les genres.",
  },
];

type Props = {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

const GendersSection = ({ selectedId, onSelect }: Props) => {
  const handleSelect = (id: string) => {
    onSelect(selectedId === id ? null : id); // toggle
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
              <div className="relative group" key={gender.id}>
                <button
                  onClick={() => handleSelect(gender.id)}
                  className={`flex items-center justify-between w-full py-2 px-3 rounded-lg transition ${
                    selectedId === gender.id
                      ? "bg-black text-white"
                      : "hover:bg-black/10"
                  }`}
                >
                  {gender.title} <MdKeyboardArrowRight />
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
};

export default GendersSection;
