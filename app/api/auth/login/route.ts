import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/utils/prisma";
import { signIn } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/settings";
import { loginSchema, formatValidationErrors } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input data
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return formatValidationErrors(parseResult);
    }
    const { email, password } = parseResult.data;

    // Find user in DB
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 400 }
      );

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 400 }
      );

    // Sign in user (create session)
    await signIn("credentials", { email, password, redirect: false });

    return NextResponse.json({ message: "Connexion réussie" }, { status: 200 });
  } catch (error) {
    console.error("API Error : ", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
