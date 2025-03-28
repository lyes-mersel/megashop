// A placeholder API route for document uploads
// This route is not yet implemented and will return a 200 status with a message.

import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { message: "Document upload route" },
    { status: 200 }
  );
}
