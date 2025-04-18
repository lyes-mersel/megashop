import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  return NextResponse.json(
    { message: `Get user with ID: ${productId}` },
    { status: 200 }
  );
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  return NextResponse.json(
    { message: `Update user with ID: ${productId}` },
    { status: 200 }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  return NextResponse.json(
    { message: `Delete user with ID: ${productId}` },
    { status: 200 }
  );
}
