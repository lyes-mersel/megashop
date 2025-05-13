// components/store/cartpage/EmptyCart.tsx
import React from "react";
import Link from "next/link";
import { TbBasketExclamation } from "react-icons/tb";
import { Button } from "@/components/ui/button";

export default function EmptyCart() {
  return (
    <div className="flex items-center flex-col text-black mt-32">
      <TbBasketExclamation strokeWidth={1} className="text-8xl text-black" />
      <span className="block mt-4 mb-8 text-lg">Votre panier est vide.</span>
      <Button
        className="rounded-full p-5 w-25 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        asChild
      >
        <Link href="/catalog">Boutique</Link>
      </Button>
    </div>
  );
}
