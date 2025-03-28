// A placeholder API route for managing a specific testimonial
// This route is not yet implemented and will return a 200 status with a message.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { message: "Get testimonial details" },
    { status: 200 }
  );
}
