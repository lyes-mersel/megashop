import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/utils/prisma";
import { UserRole } from "@prisma/client";
import { registerSchema } from "@/lib/utils/validation";
import { jsonResponse, errorHandler } from "@/lib/utils";
import { signIn } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Parse input data
    const parseResult = registerSchema.safeParse(body);
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

    const { email, password, nom, prenom } = parseResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return jsonResponse(
        { error: "Cet adresse email est déjà utilisée" },
        409
      );
    }

    // Hash password & create user
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        role: UserRole.CLIENT,
        client: {
          create: {},
        },
      },
    });

    // Sign in user (create session)
    await signIn("credentials", { email, password, redirect: false });

    return jsonResponse({ message: " Inscription réussie" }, 201);
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
