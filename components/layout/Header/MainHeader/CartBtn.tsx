"use client";

import Link from "next/link";
import Image from "next/image";

// UI Components
import { Button } from "@/components/ui/button";

// redux
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";

const CartBtn = () => {
  const { cart } = useAppSelector((state: RootState) => state.carts);

  return (
    <Link href="/cart" className="relative">
      <Button variant="ghost" className="p-1 md:p-2">
        <Image
          priority
          src="/icons/cart.svg"
          height={24}
          width={24}
          alt="cart"
          className="cursor-pointer w-auto h-[20px] md:h-[24px]"
        />
        {cart && cart.totalQuantities > 0 && (
          <span className="border bg-black text-white rounded-full w-fit-h-fit px-1 text-xs absolute -top-2 left-1/2 -translate-x-1/2">
            {cart.totalQuantities}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default CartBtn;
