import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  return NextResponse.json(
    { message: `Get order with ID: ${orderId}` },
    { status: 200 }
  );
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  return NextResponse.json(
    { message: `Update order with ID: ${orderId}` },
    { status: 200 }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  return NextResponse.json(
    { message: `Delete order with ID: ${orderId}` },
    { status: 200 }
  );
}
