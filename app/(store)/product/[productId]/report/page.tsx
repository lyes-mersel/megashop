import RestrictedAccess from "@/components/common/RestrictedAccess";
import ReportCard from "@/components/store/productpage/WriteReport";
import { auth } from "@/lib/auth";

export default async function ReportProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const session = await auth();

  if (!session) {
    return <RestrictedAccess />;
  }

  return (
    <div className="min-h-[calc(100dvh-130px)] bg-[#ebedf0] pt-12 pb-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <ReportCard productId={productId} />
    </div>
  );
}
