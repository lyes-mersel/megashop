import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  return NextResponse.json(
    { message: `Get notifications for user with ID: ${userId}` },
    { status: 200 }
  );
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  return NextResponse.json(
    { message: `Create a notification for user with ID: ${userId}` },
    { status: 201 }
  );
}
