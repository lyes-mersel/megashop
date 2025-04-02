import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { message: "Get all orders (admin)" },
    { status: 200 }
  );
}

export async function POST(_req: NextRequest) {
  return NextResponse.json({ message: "Create a new order" }, { status: 201 });
}
