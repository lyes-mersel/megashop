import bcrypt from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/utils/prisma";
import { UserRole } from "@prisma/client";
import { signIn } from "@/lib/auth";

import { registerSchema } from "@/lib/validations/auth";
import formatValidationErrors from "@/lib/validations/formatValidationErrors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Parse input data
    const parseResult = registerSchema.safeParse(body);
    if (!parseResult.success) {
      return formatValidationErrors(parseResult);
    }

    const { email, password, nom, prenom } = parseResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Cet adresse email est déjà utilisée" },
        { status: 409 }
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

    return NextResponse.json(
      { message: " Inscription réussie" },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error : ", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer plus tard !" },
      { status: 500 }
    );
  }
}
