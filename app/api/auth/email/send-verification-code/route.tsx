import { NextResponse } from "next/server";
import getAuth from "@/lib/auth/getAuth";
import { prisma } from "@/lib/utils/prisma";
import { sendVerificationEmail } from "@/lib/utils/sendEmail";
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
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
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
      { error: "Une erreur est survenue. Veuillez réessayer plus tard !" },
      { status: 500 }
    );
  }
}
