// A placeholder API route for managing a specific payment request (seller)
// This route is not yet implemented and will return a 200/204 status with a message.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { message: "Get payment request details" },
    { status: 200 }
  );
}

export async function DELETE(_req: NextRequest) {
  return NextResponse.json(
    { message: "Cancel payment request" },
    { status: 204 }
  );
}
