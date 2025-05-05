import ReviewCard from "@/components/store/productpage/WriteReview/ReviewCard";

export default async function WriteReviewPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <ReviewCard productId={productId} />
    </div>
  );
}
