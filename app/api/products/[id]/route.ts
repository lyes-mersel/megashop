// A placeholder API route for managing a specific product
// This route is not yet implemented and will return a 200/204 status with a message.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({ message: "Get product details" }, { status: 200 });
}

export async function PUT(_req: NextRequest) {
  return NextResponse.json(
    { message: "Update product details" },
    { status: 200 }
  );
}

export async function DELETE(_req: NextRequest) {
  return NextResponse.json({ message: "Delete product" }, { status: 204 });
}
