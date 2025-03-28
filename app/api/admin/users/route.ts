// A placeholder API route for managing users (admin)
// This route is not yet implemented and will return a 200/201 status with a message.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({ message: "Get all users" }, { status: 200 });
}

export async function POST(_req: NextRequest) {
  return NextResponse.json({ message: "Create a new user" }, { status: 201 });
}
