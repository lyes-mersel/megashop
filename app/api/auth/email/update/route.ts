import { NextResponse } from "next/server";
import getAuth from "@/lib/auth/getAuth";
import { prisma } from "@/lib/utils/prisma";
import { verifyTOTPCode } from "@/lib/utils/totp";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

export async function POST(req: Request) {
  try {
    const { email, newEmail, code } = await req.json();
    const session = await getAuth();

    // Ensure the user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    // Check if emailEnAttente matches
    if (email !== session.user.email) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // Fetch user with the TOTP secret for email verification
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        emailVerifie: true,
        emailEnAttente: true,
        TOTPSecret: {
          select: {
            secret: true,
            expiresLe: true,
          },
        },
      },
    });

    // Verification logic
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (!user.emailEnAttente) {
      return NextResponse.json(
        {
          error: "Aucune adresse e-mail en attente de vérification.",
        },
        { status: 400 }
      );
    }

    if (newEmail !== user.emailEnAttente) {
      return NextResponse.json(
        { error: "L'adresse e-mail ne correspond pas à celle en attente." },
        { status: 400 }
      );
    }

    if (!user.TOTPSecret) {
      return NextResponse.json(
        {
          error:
            "La vérification n'a pas été initiée pour cette adresse e-mail.",
        },
        { status: 400 }
      );
    }

    if (user.TOTPSecret.expiresLe < new Date()) {
      return NextResponse.json(
        {
          error:
            "Le code de vérification a expiré. Veuillez en générer un nouveau.",
        },
        { status: 400 }
      );
    }

    // Validate the TOTP code
    const isValid = verifyTOTPCode(code, user.TOTPSecret.secret);
    if (!isValid) {
      return NextResponse.json(
        { error: "Code de vérification invalide" },
        { status: 400 }
      );
    }

    // Mark email as verified and delete the TOTP secret
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { email: newEmail, emailVerifie: true, emailEnAttente: null },
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
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
