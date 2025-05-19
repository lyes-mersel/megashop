"use client";

import React from "react";
import ProductCard from "@/components/store/cartpage/ProductCard";
import { CartItem } from "@/redux/features/carts/cartsSlice";

interface ProductListProps {
  products: CartItem[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="w-full p-6 sm:p-8 flex-col space-y-6 rounded-2xl border border-black/10 shadow-md bg-white">
      {products.map((product, idx, arr) => (
        <React.Fragment key={idx}>
          <ProductCard data={product} />
          {arr.length - 1 !== idx && (
            <hr className="border-t border-gray-200" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
