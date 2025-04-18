import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const { reviewId } = await params;
  return NextResponse.json(
    { message: `List all responses for review ID: ${reviewId}` },
    { status: 200 }
  );
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const { reviewId } = await params;
  return NextResponse.json(
    { message: `Admin adds a new response to review ID: ${reviewId}` },
    { status: 201 }
  );
}
