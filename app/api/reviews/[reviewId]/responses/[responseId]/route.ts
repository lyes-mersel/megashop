import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      productId: string;
      reviewId: string;
      responseId: string;
    }>;
  }
) {
  const { productId, reviewId, responseId } = await params;
  return NextResponse.json(
    {
      message: `Get response ID: ${responseId} for review ID: ${reviewId} on product ID: ${productId}`,
    },
    { status: 200 }
  );
}

export async function PUT(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      productId: string;
      reviewId: string;
      responseId: string;
    }>;
  }
) {
  const { productId, reviewId, responseId } = await params;
  return NextResponse.json(
    {
      message: `Modify response ID: ${responseId} for review ID: ${reviewId} on product ID: ${productId}`,
    },
    { status: 200 }
  );
}

export async function DELETE(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      productId: string;
      reviewId: string;
      responseId: string;
    }>;
  }
) {
  const { productId, reviewId, responseId } = await params;
  return NextResponse.json(
    {
      message: `Delete response ID: ${responseId} for review ID: ${reviewId} on product ID: ${productId}`,
    },
    { status: 204 }
  );
}
