// A placeholder API route for fetching admin analytics data
// This route is not yet implemented and will return a 200 status with a message.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { message: "Fetch admin analytics data" },
    { status: 200 }
  );
}
