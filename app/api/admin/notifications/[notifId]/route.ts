import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ notifId: string }> }
) {
  const { notifId } = await params;
  return NextResponse.json(
    { message: `Get notification with ID: ${notifId}` },
    { status: 200 }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ notifId: string }> }
) {
  const { notifId } = await params;
  return NextResponse.json(
    { message: `Delete notification with ID: ${notifId}` },
    { status: 204 }
  );
}
