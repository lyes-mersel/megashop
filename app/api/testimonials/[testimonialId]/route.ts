import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ testimonialId: string }> }
) {
  const { testimonialId } = await params;
  return NextResponse.json(
    { message: `Get testimonial with ID: ${testimonialId}` },
    { status: 200 }
  );
}
