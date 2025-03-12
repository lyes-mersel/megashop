import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { jsonResponse, errorHandler } from "@/lib/utils";
import { signIn } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input data
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return jsonResponse(
        {
          error: "Certains champs sont manquants ou incorrects",
          errors: parseResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        400
      );
    }
    const { email, password } = parseResult.data;

    // Find user in DB
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return jsonResponse({ error: "Identifiants incorrects" }, 400);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return jsonResponse({ error: "Identifiants incorrects" }, 400);

    // Sign in user (create session)
    await signIn("credentials", { email, password, redirect: false });

    return jsonResponse({ message: "Connexion réussie" }, 200);
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
