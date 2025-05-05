export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";

// Components
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/store/productpage/BreadcrumbProduct";
import ProductHero from "@/components/store/productpage/ProductHero";
import Tabs from "@/components/store/productpage/Tabs";

// Types
import { ProductFromAPI } from "@/lib/types/product.types";

// Data
import {
  fetchDataFromAPI,
  fetchPaginatedDataFromAPI,
} from "@/lib/utils/fetchData";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const [productResult, newProductsResult] = await Promise.all([
    fetchDataFromAPI<ProductFromAPI>(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`
    ),
    fetchPaginatedDataFromAPI<ProductFromAPI[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/products?sortBy=dateCreation&sortOrder=desc&page=1&pageSize=4`
    ),
  ]);

  // Handle errors and status codes
  if (productResult.error) {
    if (productResult.status === 404) {
      return notFound();
    }
    console.error(productResult.error);
    return redirect("/internal-error");
  }
  if (newProductsResult.error) {
    if (newProductsResult.status === 404) {
      return notFound();
    }
    console.error(newProductsResult.error);
    redirect("/internal-error");
  }

  // Handle null data
  const product = productResult.data;
  const newProducts = newProductsResult.data;
  if (!product) {
    return notFound();
  }
  if (!newProducts) {
    redirect("/internal-error");
  }

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={product.nom} />
        <ProductHero product={product} />
        <Tabs product={product} />
      </div>
      <div className="mb-[50px] sm:mb-20">
        <ProductListSec
          title="Nos derniers arrivages"
          data={newProducts.data}
        />
      </div>
    </main>
  );
}
