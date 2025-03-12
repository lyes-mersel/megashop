"use client";

import Image from "next/image";
import Link from "next/link";

const CartBtn = () => {
  return (
    <Link href="/cart" className="relative mr-[14px] p-1">
      <Image
        priority
        src="/icons/cart.svg"
        height={100}
        width={100}
        alt="cart"
        className="max-w-[22px] max-h-[22px]"
      />
    </Link>
  );
};

export default CartBtn;
