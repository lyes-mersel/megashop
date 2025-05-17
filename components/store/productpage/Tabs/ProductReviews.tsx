"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReviewCard from "@/components/common/ReviewCard";
import Link from "next/link";
import { fetchPaginatedDataFromAPI } from "@/lib/utils/fetchData";
import { ReviewFromAPI } from "@/lib/types/review.types";
import { useRouter } from "next/navigation";

const ProductReviews = ({ productId }: { productId: string }) => {
  const router = useRouter();
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [reviewsData, setReviewsData] = useState<ReviewFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<"note" | "date">("note");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const reviewsResult = await fetchPaginatedDataFromAPI<ReviewFromAPI[]>(
          `/api/reviews?productId=${productId}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=1&pageSize=6`
        );
        // handle errors
        if (reviewsResult.error) {
          console.error(reviewsResult.error);
          router.push(`/internal-error`);
          return;
        }
        // Handle null data
        const reviews = reviewsResult.data!;
        setReviewsData(reviews.data);
        setReviewsCount(reviews.pagination.totalItems);
      } catch (error) {
        console.error(error);
        router.push(`/internal-error`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId, sortBy, sortOrder, router]);

  const handleSortChange = (value: string) => {
    if (value === "best") {
      setSortBy("note");
      setSortOrder("desc");
    } else if (value === "latest") {
      setSortBy("date");
      setSortOrder("desc");
    } else if (value === "oldest") {
      setSortBy("date");
      setSortOrder("asc");
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between flex-col sm:flex-row mb-5 sm:mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <h3 className="text-xl sm:text-2xl font-bold text-black mr-2">
            Tous les Avis
          </h3>
          <span className="text-sm sm:text-base text-black/60">
            ({reviewsCount})
          </span>
        </div>
        <div className="flex items-center space-x-2.5">
          <Select defaultValue="best" onValueChange={handleSortChange}>
            <SelectTrigger className="min-w-[120px] font-medium text-xs sm:text-base px-4 py-3 sm:px-5 sm:py-4 text-black bg-[#F0F0F0] border-none rounded-full h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="best">Meilleurs avis</SelectItem>
              <SelectItem value="latest">Plus récent</SelectItem>
              <SelectItem value="oldest">Plus ancien</SelectItem>
            </SelectContent>
          </Select>
          <Link href={`/product/${productId}/write-review`}>
            <Button
              type="button"
              className="sm:min-w-[166px] px-4 py-3 sm:px-5 sm:py-4 rounded-full bg-black font-medium text-xs sm:text-base h-12"
            >
              Ecrire un Avis
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : reviewsCount === 0 ? (
        <div className="text-center py-10 px-4">
          <p className="text-lg font-medium text-gray-600 mb-4">
            Aucun avis disponible pour ce produit.
          </p>
          <p className="text-gray-500 mb-6">
            Soyez le premier à partager votre expérience avec ce produit !
          </p>
          <Link href={`/product/${productId}/write-review`}>
            <Button
              type="button"
              className="px-6 py-3 rounded-full bg-black font-medium text-base"
            >
              Écrire un avis
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 sm:mb-9">
            {reviewsData.map((review) => (
              <ReviewCard key={review.id} review={review} isAction isDate />
            ))}
          </div>
          <div className="w-full px-4 sm:px-0 text-center">
            <Link
              href={`/product/${productId}/all-reviews`}
              className="inline-block w-[230px] px-11 py-4 border rounded-full hover:bg-black hover:text-white text-black transition-all font-medium text-sm sm:text-base border-black/10"
            >
              Charger plus d&apos;Avis
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default ProductReviews;
