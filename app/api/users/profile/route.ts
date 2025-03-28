// A placeholder API route for managing the current user's profile
// This route is not yet implemented and will return a 200 status with a message.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { message: "Get current user's profile" },
    { status: 200 }
  );
}

export async function PUT(_req: NextRequest) {
  return NextResponse.json(
    { message: "Update current user's profile" },
    { status: 200 }
  );
}
