"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CategoriesSection from "@/components/store/catalogpage/filters/CategoriesSection";
import ColorsSection from "@/components/store/catalogpage/filters/ColorsSection";
import PriceSection from "@/components/store/catalogpage/filters/PriceSection";
import SizeSection from "@/components/store/catalogpage/filters/SizeSection";
import GendersSection from "@/components/store/catalogpage/filters/GendersSection";
import ShoesSizeSection from "@/components/store/catalogpage/filters/ShoesSizeSection";

interface FiltersProps {
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
}

export default function Filters({
  selectedGender,
  selectedCategory,
  priceRange,
  selectedColor,
  selectedSize,
  onApplyFilters,
}: FiltersProps) {
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

  const handleApplyFilters = () => {
    onApplyFilters({
      gender: localGender,
      category: localCategory,
      priceRange: localPriceRange,
      color: localColor,
      size: localSize,
    });
  };

  return (
    <>
      <hr className="border-t-black/10" />
      <GendersSection selectedNom={localGender} onSelect={setLocalGender} />

      <hr className="border-t-black/10" />
      <CategoriesSection
        selectedNom={localCategory}
        onSelect={setLocalCategory}
      />

      <hr className="border-t-black/10" />
      <PriceSection value={localPriceRange} onChange={setLocalPriceRange} />

      <hr className="border-t-black/10" />
      <ColorsSection selectedNom={localColor} onSelect={setLocalColor} />

      <hr className="border-t-black/10" />
      <SizeSection selectedNom={localSize} onSelect={setLocalSize} />

      <hr className="border-t-black/10" />
      <ShoesSizeSection selectedNom={localSize} onSelect={setLocalSize} />
      
      <hr className="border-t-black/10" />
      <Button
        type="button"
        className="bg-black w-full rounded-full text-sm font-medium py-4 h-12"
        onClick={handleApplyFilters}
      >
        Appliquer les filtres
      </Button>
    </>
  );
}
