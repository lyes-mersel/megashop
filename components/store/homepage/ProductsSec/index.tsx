// Components
import ProductListSec from "@/components/common/ProductListSec";

// Types
import { ApiResponse } from "@/lib/types/apiResponse.types";
import { ProductFromAPI } from "@/lib/types/product.types";
import { redirect } from "next/navigation";

const ProductsSec = async () => {
  const fetchProductData = async (
    url: string
  ): Promise<ProductFromAPI[] | null> => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const json: ApiResponse<ProductFromAPI[]> = await res.json();
      return json.data;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      return null;
    }
  };

  const [shopProducts, marketplaceProducts] = await Promise.all([
    fetchProductData(
      `${process.env.NEXT_PUBLIC_API_URL}/products?sortBy=noteMoyenne&page=1&pageSize=4&type=boutique`
    ),
    fetchProductData(
      `${process.env.NEXT_PUBLIC_API_URL}/products?sortBy=noteMoyenne&page=1&pageSize=4&type=marketplace`
    ),
  ]);

  const isError = !shopProducts || !marketplaceProducts;
  if (isError) {
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
