import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string; reviewId: string }> }
) {
  const { productId, reviewId } = await params;
  return NextResponse.json(
    { message: `Get review with ID: ${reviewId} for product ID: ${productId}` },
    { status: 200 }
  );
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string; reviewId: string }> }
) {
  const { productId, reviewId } = await params;
  return NextResponse.json(
    { message: `Modify review ID: ${reviewId} for product ID: ${productId}` },
    { status: 200 }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string; reviewId: string }> }
) {
  const { productId, reviewId } = await params;
  return NextResponse.json(
    { message: `Delete review ID: ${reviewId} for product ID: ${productId}` },
    { status: 204 }
  );
}
