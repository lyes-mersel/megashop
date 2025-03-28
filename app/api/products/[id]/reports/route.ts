// A placeholder API route for managing reports related to a product
// This route is not yet implemented and will return a 200/201 status with a message.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { message: "Get all reports for the product" },
    { status: 200 }
  );
}

export async function POST(_req: NextRequest) {
  return NextResponse.json({ message: "Report a product" }, { status: 201 });
}
