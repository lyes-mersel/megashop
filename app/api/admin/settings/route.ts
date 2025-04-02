import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({ message: "Get admin settings" }, { status: 200 });
}

export async function PUT(_req: NextRequest) {
  return NextResponse.json(
    { message: "Update admin settings" },
    { status: 200 }
  );
}
