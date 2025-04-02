import { NextResponse } from "next/server";

import getAuth from "@/lib/auth/getAuth";
import { prisma } from "@/lib/utils/prisma";
import { verifyTOTPCode } from "@/lib/utils/totp";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants/settings";


export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    const session = await getAuth();

    // Ensure the user is authenticated and owns the email
    if (!session || email !== session.user.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Check if email is already verified
    if (session.user.emailVerifie) {
      return NextResponse.json(
        { message: "Adresse e-mail déjà vérifiée" },
        { status: 200 }
      );
    }

    // Fetch user with TOTP secret
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        emailVerifie: true,
        TOTPSecret: {
          select: {
            secret: true,
            expiresLe: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (user.emailVerifie) {
      return NextResponse.json(
        { message: "Adresse e-mail déjà vérifiée" },
        { status: 200 }
      );
    }

    if (!user.TOTPSecret) {
      return NextResponse.json(
        {
          error: "La vérification n'a pas été initiée",
        },
        { status: 400 }
      );
    }

    // Check if TOTP code is expired
    if (user.TOTPSecret.expiresLe < new Date()) {
      return NextResponse.json(
        {
          error:
            "Le code de vérification a expiré. Veuillez en générer un nouveau.",
        },
        { status: 400 }
      );
    }

    // Validate the provided TOTP code
    const isValid = verifyTOTPCode(code, user.TOTPSecret.secret);
    if (!isValid) {
      return NextResponse.json(
        { error: "Code de vérification invalide" },
        { status: 400 }
      );
    }

    // Mark email as verified and delete TOTP secret
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { emailVerifie: true },
      }),
      prisma.tOTPSecret.delete({
        where: { userId: user.id },
      }),
    ]);

    return NextResponse.json(
      { message: "Adresse e-mail vérifiée avec succès" },
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
