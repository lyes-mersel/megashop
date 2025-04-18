import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await params;
  return NextResponse.json(
    { message: `Get payment details for ID: ${paymentId}` },
    { status: 200 }
  );
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await params;
  return NextResponse.json(
    { message: `Approve or reject payment for ID: ${paymentId}` },
    { status: 200 }
  );
}
