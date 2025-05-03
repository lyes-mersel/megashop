// Dynamic rendering
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

// Components
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/store/productpage/BreadcrumbProduct";
import ProductHero from "@/components/store/productpage/ProductHero";
import Tabs from "@/components/store/productpage/Tabs";

// Utils & Helpers
import { prisma } from "@/lib/utils/prisma";
import { formatProductData, getProductSelect } from "@/lib/helpers/products";

// Data
import { relatedProductData } from "@/lib/data";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const productId = (await params).productId;

  const product = await prisma.produit.findUnique({
    where: { id: productId },
    select: getProductSelect(),
  });

  if (!product) {
    notFound();
  }

  const formattedProduct = formatProductData(product);

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={formattedProduct.nom} />
        <ProductHero productId={productId} data={formattedProduct} />
        <Tabs productId={productId} />
      </div>
      <div className="mb-[50px] sm:mb-20">
        <ProductListSec title="You might also like" data={relatedProductData} />
      </div>
    </main>
  );
}
