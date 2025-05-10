import RestrictedAccess from "@/components/common/RestrictedAccess";
import ReviewCard from "@/components/store/productpage/WriteReview";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function WriteReviewPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const session = await auth();

  if (!session) {
    return <RestrictedAccess />;
  }

  if (!session.user.emailVerifie) {
    redirect(
      `/auth/verify-email?callbackUrl=${encodeURIComponent(
        `/product/${productId}/write-review`
      )}`
    );
  }

  return (
    <div className="min-h-[calc(100dvh-125px)] bg-[#ebedf0] pt-12 pb-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <ReviewCard productId={productId} />
    </div>
  );
}
