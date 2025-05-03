"use client";

// Redux
import { RootState } from "@/redux/store";
import { addToCart } from "@/redux/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Types
import { ProductFromAPI } from "@/lib/types/product.types";

const AddToCartBtn = ({
  data,
}: {
  data: ProductFromAPI & { quantity: number };
}) => {
  const dispatch = useAppDispatch();
  const { sizeSelection, colorSelection } = useAppSelector(
    (state: RootState) => state.products
  );

  return (
    <button
      type="button"
      className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all"
      onClick={() =>
        dispatch(
          addToCart({
            id: Number(data.id),
            name: data.nom,
            imagePublicId: data.images[0].imagePublicId,
            price: data.prix,
            attributes: [sizeSelection, colorSelection.name],
            quantity: data.quantity,
          })
        )
      }
    >
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;
