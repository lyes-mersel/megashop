import getAuth from "@/lib/auth/getAuth";
import { prisma } from "@/lib/utils/prisma";
import { jsonResponse } from "@/lib/utils";
import { errorHandler } from "@/lib/utils";
import { verifyTOTPCode } from "@/lib/utils/totp";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    const session = await getAuth();

    // Ensure the user is authenticated and owns the email
    if (!session || email !== session.user.email) {
      return jsonResponse({ error: "Forbidden" }, 403);
    }

    // Check if email is already verified
    if (session.user.emailVerifie) {
      return jsonResponse({ message: "Adresse e-mail déjà vérifiée" }, 200);
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
      return jsonResponse({ error: "Utilisateur non trouvé" }, 404);
    }

    if (user.emailVerifie) {
      return jsonResponse({ message: "Adresse e-mail déjà vérifiée" }, 200);
    }

    if (!user.TOTPSecret) {
      return jsonResponse(
        {
          error: "La vérification n'a pas été initiée",
        },
        400
      );
    }

    // Check if TOTP code is expired
    if (user.TOTPSecret.expiresLe < new Date()) {
      return jsonResponse(
        {
          error:
            "Le code de vérification a expiré. Veuillez en générer un nouveau.",
        },
        400
      );
    }

    // Validate the provided TOTP code
    const isValid = verifyTOTPCode(code, user.TOTPSecret.secret);
    if (!isValid) {
      return jsonResponse({ error: "Code de vérification invalide" }, 400);
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

    return jsonResponse(
      { message: "Adresse e-mail vérifiée avec succès" },
      200
    );
  } catch (error: unknown) {
    errorHandler(error);
  }
}
