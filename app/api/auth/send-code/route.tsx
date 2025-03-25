import getAuth from "@/lib/auth/getAuth";
import { prisma } from "@/lib/utils/prisma";
import { sendVerificationEmail } from "@/lib/utils/sendEmail";
import { errorHandler, jsonResponse } from "@/lib/utils";
import {
  generateTOTPCode,
  generateTOTPSecret,
  TOTP_EXPIRATION_DURATION,
} from "@/lib/utils/totp";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const session = await getAuth();

    // Check if user is logged in
    if (!session || email !== session.user.email) {
      return jsonResponse({ error: "Forbidden" }, 403);
    }

    // Check if email is already verified
    if (session.user.emailVerifie) {
      return jsonResponse({ message: "Adresse e-mail déjà vérifiée" }, 200);
    }

    // Generate secret for this user
    const secret = generateTOTPSecret();
    const code = generateTOTPCode(secret);

    // Store secret in db
    await prisma.tOTPSecret.upsert({
      where: { userId: session?.user.id },
      update: {
        secret,
        expiresLe: new Date(Date.now() + TOTP_EXPIRATION_DURATION * 1000),
      },
      create: {
        userId: session?.user.id as string,
        secret,
        expiresLe: new Date(Date.now() + TOTP_EXPIRATION_DURATION * 1000),
      },
    });

    // Send the code via email
    await sendVerificationEmail(email, code);

    return jsonResponse({ message: "Code envoyé" }, 200);
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
