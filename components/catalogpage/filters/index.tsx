// UI Components
import { Button } from "@/components/ui/button";

// Components
import CategoriesSection from "@/components/catalogpage/filters/CategoriesSection";
import ColorsSection from "@/components/catalogpage/filters/ColorsSection";
import PriceSection from "@/components/catalogpage/filters/PriceSection";
import SizeSection from "@/components/catalogpage/filters/SizeSection";

const Filters = () => {
  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesSection />
      <hr className="border-t-black/10" />
      <PriceSection />
      <hr className="border-t-black/10" />
      <ColorsSection />
      <hr className="border-t-black/10" />
      <SizeSection />
      <hr className="border-t-black/10" />
      <Button
        type="button"
        className="bg-black w-full rounded-full text-sm font-medium py-4 h-12"
      >
        Apply Filter
      </Button>
    </>
  );
};

export default Filters;
