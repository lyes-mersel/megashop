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

export default function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const router = useRouter();

  const hasFetchedRef = useRef(false);
  const [product, setProduct] = useState<ProductFromAPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

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
  }, [params, router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100dvh-125px)] flex flex-col items-center justify-center py-20 gap-4 text-gray-700">
        <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <p className="text-lg font-medium">Chargement de la page...</p>
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
