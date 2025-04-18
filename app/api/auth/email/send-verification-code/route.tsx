import { NextResponse } from "next/server";

import getAuth from "@/lib/auth/getAuth";
import { prisma } from "@/lib/utils/prisma";
import {
  generateTOTPCode,
  generateTOTPSecret,
  TOTP_EXPIRATION_DURATION,
} from "@/lib/utils/totp";
import { sendVerificationEmail } from "@/lib/helpers/sendEmail";
import { ERROR_MESSAGES } from "@/lib/constants/settings";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const session = await getAuth();

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    // Checks if the email matches the logged-in user's email.
    if (email !== session.user.email) {
      return NextResponse.json(
        {
          error: "L'adresse e-mail ne correspond pas à l'utilisateur connecté",
        },
        { status: 403 }
      );
    }

    // Check if email is already verified
    if (session.user.emailVerifie) {
      return NextResponse.json(
        { message: "Adresse e-mail déjà vérifiée" },
        { status: 200 }
      );
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

    return NextResponse.json({ message: "Code envoyé" }, { status: 200 });
  } catch (error) {
    console.error("API Error : ", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
