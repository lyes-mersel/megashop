import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  // Check if orderId is valid
  if (!orderId) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  return NextResponse.json(
    {
      message: "Order details fetched successfully",
      data: { orderId },
    },
    { status: 200 }
  );
}
