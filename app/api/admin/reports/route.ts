// A placeholder API route for managing reports (admin)
// This route is not yet implemented and will return a 200 status with a message.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({ message: "Get all reports" }, { status: 200 });
}
