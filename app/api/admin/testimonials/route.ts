import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { message: "Get all testimonials" },
    { status: 200 }
  );
}

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { message: "Add a new testimonial" },
    { status: 201 }
  );
}
