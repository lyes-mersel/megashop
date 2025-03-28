import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;
  return NextResponse.json(
    { message: `Get report with ID: ${reportId}` },
    { status: 200 }
  );
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;
  return NextResponse.json(
    { message: `Patch report with ID: ${reportId}` },
    { status: 201 }
  );
}


export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;
  return NextResponse.json(
    { message: `Delete report with ID: ${reportId}` },
    { status: 204 }
  );
}
