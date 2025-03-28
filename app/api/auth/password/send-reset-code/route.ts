import { prisma } from "@/lib/utils/prisma";
import { sendPasswordResetEmail } from "@/lib/utils/sendEmail";
import { errorHandler, jsonResponse } from "@/lib/utils";
import {
  generateTOTPCode,
  generateTOTPSecret,
  TOTP_EXPIRATION_DURATION,
} from "@/lib/utils/totp";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Check if the email exists in the database
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return jsonResponse({ error: "Aucun compte associé à cet email." }, 404);
    }

    // Generate secret for password reset
    const secret = generateTOTPSecret();
    const code = generateTOTPCode(secret);

    // Store the secret in the database
    await prisma.tOTPSecret.upsert({
      where: { userId: user.id },
      update: {
        secret,
        expiresLe: new Date(Date.now() + TOTP_EXPIRATION_DURATION * 1000),
      },
      create: {
        userId: user.id,
        secret,
        expiresLe: new Date(Date.now() + TOTP_EXPIRATION_DURATION * 1000),
      },
    });

    // Send the password reset code via email
    await sendPasswordResetEmail(email, code);

    return jsonResponse(
      {
        message:
          "Un code de réinitialisation a été envoyé à votre adresse e-mail.",
      },
      200
    );
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
