import { NextResponse } from "next/server";
import { ZodError, SafeParseReturnType } from "zod";

/**
 * Returns a standardized JSON response for Zod validation errors.
 */
export default function formatValidationErrors<T>(
  parseResult: SafeParseReturnType<T, T>
) {
  return NextResponse.json(
    {
      error: "Certains champs sont manquants ou incorrects",
      data: (parseResult.error as ZodError).issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    },
    { status: 400 }
  );
}
