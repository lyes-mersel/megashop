// A placeholder API route for searching products, users, or other entities
// This route is not yet implemented and will return a 200 status with a message.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({ message: "Search results" }, { status: 200 });
}
