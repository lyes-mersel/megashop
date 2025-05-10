// Components
import ProductListSec from "@/components/common/ProductListSec";

// Types
import { ProductFromAPI } from "@/lib/types/product.types";
import { fetchPaginatedDataFromAPI } from "@/lib/utils/fetchData";
import { redirect } from "next/navigation";

const ProductsSec = async () => {
  // Fetch data for shop and marketplace products
  const [shopProductsResult, marketplaceProductsResult] = await Promise.all([
    fetchPaginatedDataFromAPI<ProductFromAPI[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/products?sortBy=noteMoyenne&sortOrder=desc&page=1&pageSize=4&type=boutique`
    ),
    fetchPaginatedDataFromAPI<ProductFromAPI[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/products?sortBy=noteMoyenne&sortOrder=desc&page=1&pageSize=4&type=marketplace`
    ),
  ]);

  // Handle errors
  if (shopProductsResult.error || marketplaceProductsResult.error) {
    return redirect("/internal-error");
  }

  // Extract data & handle null data
  const shopProducts = shopProductsResult.data?.data;
  const marketplaceProducts = marketplaceProductsResult.data?.data;
  if (!shopProducts || !marketplaceProducts) {
    redirect("/internal-error");
  }

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
    </section>
  );
};

export default ProductsSec;
