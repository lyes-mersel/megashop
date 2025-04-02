import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { message: "Fetch admin analytics data" },
    { status: 200 }
  );
}
