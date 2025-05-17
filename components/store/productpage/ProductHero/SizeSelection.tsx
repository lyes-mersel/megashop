"use client";

// Utils
import { cn } from "@/lib/utils";

// Redux
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSizeSelection } from "@/redux/features/products/productsSlice";

// Types
export type Size = {
  id: string;
  nom: string;
};

const SizeSelection = ({ sizes }: { sizes: Size[] }) => {
  const { sizeSelection } = useAppSelector(
    (state: RootState) => state.products
  );
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col">
      <span className="text-sm sm:text-base text-black/60 mb-4">
        Choisissez la taille
      </span>
      <div className="flex items-center flex-wrap lg:space-x-3">
        {sizes.map((size, index) => (
          <button
            key={index}
            type="button"
            className={cn([
              "bg-[#F0F0F0] flex items-center justify-center px-5 lg:px-6 py-2.5 lg:py-3 text-sm lg:text-base rounded-full m-1 lg:m-0 max-h-[46px]",
              sizeSelection.nom === size.nom &&
                "bg-black font-medium text-white",
            ])}
            onClick={() => dispatch(setSizeSelection(size))}
          >
            {size.nom}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelection;
