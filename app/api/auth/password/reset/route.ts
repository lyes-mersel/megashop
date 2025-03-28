import { prisma } from "@/lib/utils/prisma";
import { jsonResponse, errorHandler } from "@/lib/utils";
import { verifyTOTPCode } from "@/lib/utils/totp";
import bcrypt from "bcryptjs";
import { resetPasswordSchema } from "@/lib/utils/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input data
    const parseResult = resetPasswordSchema.safeParse(body);
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
      return jsonResponse(
        { error: "Utilisateur non trouvé ou code non généré" },
        404
      );
    }

    // Check if TOTP code is expired
    if (user.TOTPSecret.expiresLe < new Date()) {
      return jsonResponse(
        { error: "Le code a expiré. Veuillez en générer un nouveau." },
        400
      );
    }

    // Validate TOTP code
    const isValid = verifyTOTPCode(code, user.TOTPSecret.secret);
    if (!isValid) {
      return jsonResponse({ error: "Code de vérification invalide" }, 400);
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

    return jsonResponse(
      { message: "Mot de passe réinitialisé avec succès" },
      200
    );
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
