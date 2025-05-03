// Dynamic rendering
export const dynamic = "force-dynamic";

// Components
import ProductListSec from "@/components/common/ProductListSec";

// Data
import { formatProductData, getProductSelect } from "@/lib/helpers/products";
import { prisma } from "@/lib/utils/prisma";

const ProductsSec = async () => {
  const [shopProductsRaw, marketplaceProductsRaw] = await Promise.all([
    prisma.produit.findMany({
      where: { produitBoutique: { isNot: null } },
      select: getProductSelect(),
      orderBy: { noteMoyenne: "desc" },
      take: 4,
    }),
    prisma.produit.findMany({
      where: { produitMarketplace: { isNot: null } },
      select: getProductSelect(),
      orderBy: { noteMoyenne: "desc" },
      take: 4,
    }),
  ]);

  const shopProducts = shopProductsRaw.map(formatProductData);
  const marketplaceProducts = marketplaceProductsRaw.map(formatProductData);

  return (
    <section className="my-[50px] sm:my-[72px]">
      <ProductListSec
        title="Explorez Notre Boutique"
        description="Produits vendus et expédiés directement par nous"
        data={shopProducts}
        viewAllLink="/catalog?type=boutique"
      />
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
      </div>
      <div className="mb-[50px] sm:mb-20">
        <ProductListSec
          title="Explorez Notre Marketplace"
          description="Produits proposés par nos vendeurs partenaires"
          data={marketplaceProducts}
          viewAllLink="/catalog?type=marketplace"
        />
      </div>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
      </div>
    </section>
  );
};

export default ProductsSec;
