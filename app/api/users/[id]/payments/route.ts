// A placeholder API route for managing a user's payment requests (seller)
// This route is not yet implemented and will return a 200/201 status with a message.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { message: "Get all payment requests for user" },
    { status: 200 }
  );
}

export async function POST(_req: NextRequest) {
  return NextResponse.json({ message: "Request a payment" }, { status: 201 });
}
