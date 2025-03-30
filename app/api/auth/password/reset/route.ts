import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/utils/prisma";
import { verifyTOTPCode } from "@/lib/utils/totp";
import { resetPasswordSchema } from "@/lib/validations";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants/settings";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input data
    const parseResult = resetPasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Certains champs sont manquants ou incorrects",
          errors: parseResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }
    const { email, code, newPassword } = parseResult.data;

    // Fetch user and TOTP secret
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        TOTPSecret: {
          select: {
            secret: true,
            expiresLe: true,
          },
        },
      },
    });

    if (!user || !user.TOTPSecret) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé ou code non généré" },
        { status: 400 }
      );
    }

    // Check if TOTP code is expired
    if (user.TOTPSecret.expiresLe < new Date()) {
      return NextResponse.json(
        { error: "Le code a expiré. Veuillez en générer un nouveau." },
        { status: 400 }
      );
    }

    // Validate TOTP code
    const isValid = verifyTOTPCode(code, user.TOTPSecret.secret);
    if (!isValid) {
      return NextResponse.json(
        { error: "Code de vérification invalide" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and delete TOTP secret
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.tOTPSecret.delete({ where: { userId: user.id } }),
    ]);

    return NextResponse.json(
      { message: "Mot de passe réinitialisé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error : ", error);
    return NextResponse.json(
      { error: INTERNAL_ERROR_MESSAGE },
      { status: 500 }
    );
  }
}
