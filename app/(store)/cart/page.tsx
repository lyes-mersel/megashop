// CartPage.tsx
"use client";

import React from "react";

// Components
import BreadcrumbCart from "@/components/store/cartpage/BreadcrumbCart";
import ProductList from "@/components/store/cartpage/ProductList";
import CartOrderSummary from "@/components/store/cartpage/CartOrderSummary";
import EmptyCart from "@/components/store/cartpage/EmptyCart";

// Utils & Styles
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";

// Redux
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";

export default function CartPage() {
  const { cart } = useAppSelector((state: RootState) => state.carts);
  const hasItems = cart && cart.items.length > 0;

  return (
    <main
      className={`min-h-[calc(100dvh-125px)] py-10 ${
        hasItems ? "bg-white" : "bg-[#ebedf0]"
      }`}
    >
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        {hasItems ? (
          <>
            <BreadcrumbCart />
            <h2
              className={cn(
                integralCF.className,
                "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6"
              )}
            >
              votre panier
            </h2>
            <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 items-start">
              <ProductList products={cart.items} />
              <CartOrderSummary />
            </div>
          </>
        ) : (
          <EmptyCart />
        )}
      </div>
    </main>
  );
}
