import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string; notifId: string }> }
) {
  const { userId, notifId } = await params;
  return NextResponse.json(
    {
      message: `Get notification with ID: ${notifId} for user with ID: ${userId}`,
    },
    { status: 200 }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string; notifId: string }> }
) {
  const { userId, notifId } = await params;
  return NextResponse.json(
    {
      message: `Delete notification with ID: ${notifId} for user with ID: ${userId}`,
    },
    { status: 204 }
  );
}
