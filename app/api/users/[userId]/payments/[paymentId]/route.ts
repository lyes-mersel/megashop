import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string; paymentId: string }> }
) {
  const { userId, paymentId } = await params;
  return NextResponse.json(
    {
      message: `Get payment details for ID: ${paymentId} of user ID: ${userId}`,
    },
    { status: 200 }
  );
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string; paymentId: string }> }
) {
  const { userId, paymentId } = await params;
  return NextResponse.json(
    {
      message: `Approve or reject payment with ID: ${paymentId} for user ID: ${userId}`,
    },
    { status: 200 }
  );
}
