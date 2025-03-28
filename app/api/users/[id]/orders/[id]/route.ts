// A placeholder API route for managing a specific order
// This route is not yet implemented and will return a 200/204 status with a message.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({ message: "Get order details" }, { status: 200 });
}

export async function DELETE(_req: NextRequest) {
  return NextResponse.json({ message: "Cancel order" }, { status: 204 });
}
