"use client";

import Image from "next/image";
import Link from "next/link";
import { PiTrashFill } from "react-icons/pi";

// UI Components
import CartCounter from "@/components/ui/CartCounter";
import { Button } from "../../ui/button";

// Redux
import {
  addToCart,
  CartItem,
  remove,
  removeCartItem,
} from "@/redux/features/carts/cartsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { getImageUrlFromPublicId } from "@/lib/utils";

type ProductCardProps = {
  data: CartItem;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-start space-x-4">
      <Link
        href={`/shop/product/${data.id}/${data.name.split(" ").join("-")}`}
        className="bg-[#F0EEED] rounded-lg w-full min-w-[100px] max-w-[100px] sm:max-w-[124px] aspect-square overflow-hidden"
      >
        <Image
          src={getImageUrlFromPublicId(data.imagePublicId)}
          width={124}
          height={124}
          className="rounded-md w-full h-full object-cover hover:scale-110 transition-all duration-500"
          alt={data.name}
          priority
        />
      </Link>
      <div className="flex w-full self-stretch flex-col">
        <div className="flex items-center justify-between">
          <Link
            href={`/shop/product/${data.id}/${data.name.split(" ").join("-")}`}
            className="text-black font-bold text-base xl:text-xl"
          >
            {data.name}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 md:h-9 md:w-9"
            onClick={() =>
              dispatch(
                remove({
                  id: data.id,
                  attributes: data.attributes,
                  quantity: data.quantity,
                })
              )
            }
          >
            <PiTrashFill className="text-xl md:text-2xl text-red-600" />
          </Button>
        </div>
        <div className="-mt-1">
          <span className="text-black text-xs md:text-sm mr-1">Taille:</span>
          <span className="text-black/60 text-xs md:text-sm">
            {data.attributes[0]}
          </span>
        </div>
        <div className="mb-auto -mt-1.5">
          <span className="text-black text-xs md:text-sm mr-1">Couleur:</span>
          <span className="text-black/60 boder-1 border-gray-300 text-xs md:text-sm">
            {data.attributes[1]}
          </span>
        </div>
        <div className="flex items-center flex-wrap justify-between">
          <span className="font-bold text-black  text-xl xl:text-2xl">
            {data.price}DA
          </span>

          <CartCounter
            initialValue={data.quantity}
            onAdd={() => dispatch(addToCart({ ...data, quantity: 1 }))}
            onRemove={() =>
              data.quantity === 1
                ? dispatch(
                    remove({
                      id: data.id,
                      attributes: data.attributes,
                      quantity: data.quantity,
                    })
                  )
                : dispatch(
                    removeCartItem({ id: data.id, attributes: data.attributes })
                  )
            }
            isZeroDelete
            className="px-5 py-3 max-h-8 md:max-h-10 min-w-[105px] max-w-[105px] sm:max-w-32"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
