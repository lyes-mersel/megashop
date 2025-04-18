import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string; reviewId: string }> }
) {
  const { productId, reviewId } = await params;
  return NextResponse.json(
    {
      message: `List all responses for review ID: ${reviewId} on product ID: ${productId}`,
    },
    { status: 200 }
  );
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string; reviewId: string }> }
) {
  const { productId, reviewId } = await params;
  return NextResponse.json(
    {
      message: `Create a new response for review ID: ${reviewId} on product ID: ${productId}`,
    },
    { status: 201 }
  );
}
