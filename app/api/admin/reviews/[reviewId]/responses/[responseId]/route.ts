import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reviewId: string; responseId: string }> }
) {
  const { reviewId, responseId } = await params;
  return NextResponse.json(
    { message: `Get response ID: ${responseId} for review ID: ${reviewId}` },
    { status: 200 }
  );
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ reviewId: string; responseId: string }> }
) {
  const { reviewId, responseId } = await params;
  return NextResponse.json(
    {
      message: `Admin modifies response ID: ${responseId} for review ID: ${reviewId}`,
    },
    { status: 200 }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ reviewId: string; responseId: string }> }
) {
  const { reviewId, responseId } = await params;
  return NextResponse.json(
    {
      message: `Admin deletes response ID: ${responseId} for review ID: ${reviewId}`,
    },
    { status: 204 }
  );
}
