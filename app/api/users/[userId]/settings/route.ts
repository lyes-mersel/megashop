import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({ message: "Get user settings" }, { status: 200 });
}

export async function PUT(_req: NextRequest) {
  return NextResponse.json(
    { message: "Update user settings" },
    { status: 200 }
  );
}
