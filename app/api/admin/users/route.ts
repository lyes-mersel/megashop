import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({ message: "Get all users" }, { status: 200 });
}

export async function POST(_req: NextRequest) {
  return NextResponse.json({ message: "Create a new user" }, { status: 201 });
}
