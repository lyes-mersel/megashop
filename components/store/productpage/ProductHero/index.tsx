// UI Components
import Rating from "@/components/ui/Rating";

// Components
import PhotoSection from "./PhotoSection";
import ColorSelection from "./ColorSelection";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";

// Utils & Types
import { cn } from "@/lib/utils";
import { ProductFromAPI } from "@/lib/types/product.types";

// Styles
import { integralCF } from "@/styles/fonts";

const ProductHero = ({
  productId,
  data,
}: {
  productId: string;
  data: ProductFromAPI;
}) => {
  console.log(productId);
  return (
    <section className="mb-11">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <PhotoSection data={data} />
        </div>
        <div>
          <h1
            className={cn([
              integralCF.className,
              "text-2xl md:text-[40px] md:leading-[40px] mb-3 md:mb-3.5 capitalize",
            ])}
          >
            {data.nom}
          </h1>

          <div className="flex items-center mb-3 sm:mb-3.5">
            <Rating
              initialValue={data.noteMoyenne}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-50"
              size={25}
              readonly
            />
            <span className="text-black text-xs sm:text-sm ml-[11px] sm:ml-[13px] pb-0.5 sm:pb-0">
              {data.noteMoyenne.toFixed(1)}
              <span className="text-black/60">/5</span>
            </span>
          </div>

          <span className="font-bold text-black text-2xl sm:text-[32px]">
            {data.prix} DA
          </span>

          <p className="text-sm sm:text-base text-black/60 mb-5">
            {data.description}
          </p>
          <hr className="h-[1px] border-t-black/10 mb-5" />

          <ColorSelection />
          <hr className="h-[1px] border-t-black/10 my-5" />

          <SizeSelection />
          <hr className="hidden md:block h-[1px] border-t-black/10 my-5" />

          <AddToCardSection data={data} />
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
