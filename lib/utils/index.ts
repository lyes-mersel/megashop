import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextResponse } from "next/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function jsonResponse(
  data: Record<string, unknown>,
  status: number = 200,
  headers?: Record<string, string>
): NextResponse {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export function errorHandler(err: unknown) {
  console.error("API Error : ", err);

  return jsonResponse(
    { error: "Une erreur est survenue. Veuillez réessayer plus tard !" },
    500
  );
}

export const compareArrays = (a: unknown[], b: unknown[]) => {
  return a.toString() === b.toString();
};
