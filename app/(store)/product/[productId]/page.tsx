"use client";

import { useEffect, useRef, useState } from "react";
import { notFound, useRouter } from "next/navigation";

// Components
import BreadcrumbProduct from "@/components/store/productpage/BreadcrumbProduct";
import ProductHero from "@/components/store/productpage/ProductHero";
import Tabs from "@/components/store/productpage/Tabs";

// Types
import { ProductFromAPI } from "@/lib/types/product.types";

// Data utils
import { fetchDataFromAPI } from "@/lib/utils/fetchData";
import LastArrivals from "@/components/store/productpage/LastArrivals";
import { useAppDispatch } from "@/redux/hooks";
import { resetSelections } from "@/redux/features/products/productsSlice";

export default function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasFetchedRef = useRef(false);
  const [product, setProduct] = useState<ProductFromAPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    dispatch(resetSelections());

    const fetchData = async () => {
      try {
        const { productId } = await params;
        const productResult = await fetchDataFromAPI<ProductFromAPI>(
          `/api/products/${productId}`
        );

        if (productResult.error) {
          if (productResult.status === 404) return notFound();
          console.error(productResult.error);
          return router.push("/internal-error");
        }

        if (!productResult.data) return router.push("/not-found");

        setProduct(productResult.data);
      } catch (error) {
        console.error("Unexpected error:", error);
        router.push("/internal-error");
      } finally {
        setLoading(false);
        hasFetchedRef.current = true;
      }
    };

    fetchData();
  }, [params, router, dispatch]);

  if (loading) {
    return (
      <div className="min-h-[calc(100dvh-125px)] flex flex-col items-center justify-center text-center py-12">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-800 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <span className="mt-5 text-lg font-medium">Chargement de la page...</span>
      </div>
    );
  }

  if (!product) return notFound();

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={product.nom} />
        <ProductHero product={product} />
        <Tabs product={product} />
      </div>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
      </div>
      <LastArrivals />
    </main>
  );
}
