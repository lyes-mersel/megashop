// Components
import ProductListSec from "@/components/common/ProductListSec";

// Data
import { shopProductsData, marketProductsData } from "@/lib/data";

const ProductsSec = () => {
  return (
    <section className="my-[50px] sm:my-[72px]">
      <ProductListSec
        title="Explorez Notre Boutique"
        description="Produits vendus et expédiés directement par nous"
        data={shopProductsData}
        viewAllLink="/catalog?type=boutique"
      />
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
      </div>
      <div className="mb-[50px] sm:mb-20">
        <ProductListSec
          title="Explorez Notre Marketplace"
          description="Produits proposés par nos vendeurs partenaires"
          data={marketProductsData}
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
