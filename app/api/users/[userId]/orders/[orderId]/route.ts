import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string; orderId: string }> }
) {
  const { userId, orderId } = await params;
  return NextResponse.json(
    { message: `Get order with ID: ${orderId} for user with ID: ${userId}` },
    { status: 200 }
  );
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string; orderId: string }> }
) {
  const { userId, orderId } = await params;
  return NextResponse.json(
    { message: `Update order with ID: ${orderId} for user with ID: ${userId}` },
    { status: 200 }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string; orderId: string }> }
) {
  const { userId, orderId } = await params;
  return NextResponse.json(
    { message: `Delete order with ID: ${orderId} for user with ID: ${userId}` },
    { status: 200 }
  );
}
