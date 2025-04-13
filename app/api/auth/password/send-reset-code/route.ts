import { NextResponse } from "next/server";

import { prisma } from "@/lib/utils/prisma";
import { sendPasswordResetEmail } from "@/lib/helpers/sendEmail";
import {
  generateTOTPCode,
  generateTOTPSecret,
  TOTP_EXPIRATION_DURATION,
} from "@/lib/utils/totp";
import { ERROR_MESSAGES } from "@/lib/constants/settings";


export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Check if the email exists in the database
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Aucun compte associé à cet email." },
        { status: 404 }
      );
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

    return NextResponse.json(
      {
        message:
          "Un code de réinitialisation a été envoyé à votre adresse e-mail.",
      },
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
