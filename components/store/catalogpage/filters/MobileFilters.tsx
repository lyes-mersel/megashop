"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FiSliders } from "react-icons/fi";
import Filters from ".";

interface MobileFiltersProps {
  selectedGender: string | null;
  selectedCategory: string | null;
  priceRange: [number, number];
  selectedColor: string | null;
  selectedSize: string | null;
  onApplyFilters: (filters: {
    gender: string | null;
    category: string | null;
    priceRange: [number, number];
    color: string | null;
    size: string | null;
  }) => void;
  onResetFilters: () => void;
}

const MobileFilters = ({
  selectedGender,
  selectedCategory,
  priceRange,
  selectedColor,
  selectedSize,
  onApplyFilters,
  onResetFilters,
}: MobileFiltersProps) => {
  const [localGender, setLocalGender] = useState<string | null>(selectedGender);
  const [localCategory, setLocalCategory] = useState<string | null>(
    selectedCategory
  );
  const [localPriceRange, setLocalPriceRange] =
    useState<[number, number]>(priceRange);
  const [localColor, setLocalColor] = useState<string | null>(selectedColor);
  const [localSize, setLocalSize] = useState<string | null>(selectedSize);

  // Sync local state with searchParams props when they change
  useEffect(() => {
    setLocalGender(selectedGender);
    setLocalCategory(selectedCategory);
    setLocalPriceRange(priceRange);
    setLocalColor(selectedColor);
    setLocalSize(selectedSize);
  }, [
    selectedGender,
    selectedCategory,
    priceRange,
    selectedColor,
    selectedSize,
  ]);

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <button
            type="button"
            className="h-8 w-8 rounded-full bg-[#F0F0F0] text-black p-1 md:hidden"
          >
            <FiSliders className="text-base mx-auto" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90%]">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filtres</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <DrawerTitle className="hidden">Filtres</DrawerTitle>
            <DrawerDescription className="hidden">
              Sélectionnez vos filtres
            </DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[90%] overflow-y-auto w-full px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <Filters
              localGender={localGender}
              setLocalGender={setLocalGender}
              localCategory={localCategory}
              setLocalCategory={setLocalCategory}
              localPriceRange={localPriceRange}
              setLocalPriceRange={setLocalPriceRange}
              localColor={localColor}
              setLocalColor={setLocalColor}
              localSize={localSize}
              setLocalSize={setLocalSize}
              onApplyFilters={onApplyFilters}
              onResetFilters={onResetFilters}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileFilters;
