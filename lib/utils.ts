import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextResponse } from "next/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function jsonResponse(data: object, status: number = 200): NextResponse {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorHandler(err: unknown) {
  console.error("API Error : ", err);

  return jsonResponse(
    { error: "Une erreur est survenue. Veuillez réessayer plus tard !" },
    500
  );
}
