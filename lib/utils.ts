import { NextResponse } from "next/server";

export function jsonResponse(data: object, status: number = 200): NextResponse {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorHandler(err: unknown) {
  console.error("API Error : ", err);

  if (err instanceof Error) {
    return jsonResponse({ error: err.message }, 500);
  }
  return jsonResponse(
    { error: "Something went wrong. Please try again later!" },
    500
  );
}
