// A placeholder API route for managing a user's cart
// This route is not yet implemented and will return a 200/201 status with a message.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({ message: "Get cart items" }, { status: 200 });
}

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { message: "Add an item to the cart" },
    { status: 201 }
  );
}
