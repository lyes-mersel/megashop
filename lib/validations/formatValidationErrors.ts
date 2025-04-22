import { NextResponse } from "next/server";
import { ZodError, SafeParseReturnType, SafeParseError } from "zod";

/**
 * Returns a standardized JSON response for Zod validation errors.
 */
export default function formatValidationErrors<T>(
  parseResult: SafeParseReturnType<T, T>,
  customMessage = "Certains champs sont manquants ou incorrects"
) {
  return NextResponse.json(
    {
      error: customMessage,
      data: (parseResult.error as ZodError).issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    },
    { status: 400 }
  );
}

/**
 * Returns a standardized JSON response for Zod validation errors.
 * It uses the `flatten` method to get a more structured error response.
 */
export function formatValidationErrorsV2(result: SafeParseError<unknown>) {
  return NextResponse.json(
    {
      error: "Invalid input",
      details: result.error.flatten().fieldErrors,
    },
    { status: 400 }
  );
}
