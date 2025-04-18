import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const { reviewId } = await params;
  return NextResponse.json(
    { message: `Get review with ID: ${reviewId}` },
    { status: 200 }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const { reviewId } = await params;
  return NextResponse.json(
    { message: `Delete review ID: ${reviewId}` },
    { status: 204 }
  );
}
