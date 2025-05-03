export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";

// Components
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/store/productpage/BreadcrumbProduct";
import ProductHero from "@/components/store/productpage/ProductHero";
import Tabs from "@/components/store/productpage/Tabs";

// Types
import { ApiResponse } from "@/lib/types/apiResponse.types";
import { ProductFromAPI } from "@/lib/types/product.types";

// Data
import { relatedProductData } from "@/lib/data";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  let product: ProductFromAPI | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`
    );

    if (!res.ok && res.status !== 404) {
      throw new Error("An error occurred while fetching the product");
    } else {
      const json: ApiResponse<ProductFromAPI> = await res.json();
      product = json.data;
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    return redirect("/internal-error");
  }

  if (!product) {
    return notFound();
  }

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={product.nom} />
        <ProductHero productId={productId} data={product} />
        <Tabs productId={productId} />
      </div>
      <div className="mb-[50px] sm:mb-20">
        <ProductListSec title="You might also like" data={relatedProductData} />
      </div>
    </main>
  );
}
