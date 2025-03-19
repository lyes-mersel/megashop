import { notFound } from "next/navigation";

// Components
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/productpage/BreadcrumbProduct";
import ProductHero from "@/components/productpage/ProductHero";
import Tabs from "@/components/productpage/Tabs";

// Types
import { Product } from "@/lib/types/product.types";

// Data
import {
  shopProductsData,
  marketProductsData,
  relatedProductData,
  topSellingData,
} from "@/lib/data";

const data: Product[] = [
  ...shopProductsData,
  ...marketProductsData,
  ...topSellingData,
  ...relatedProductData,
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const productId = (await params).productId;

  const productData = data.find((product) => product.id === Number(productId));
  if (!productData?.title) {
    notFound();
  }

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={productData?.title ?? "product"} />
        <ProductHero productId={productId} data={productData} />
        <Tabs productId={productId} />
      </div>
      <div className="mb-[50px] sm:mb-20">
        <ProductListSec title="You might also like" data={relatedProductData} />
      </div>
    </main>
  );
}
