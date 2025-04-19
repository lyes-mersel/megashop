import nodemailer from "nodemailer";
import { prisma } from "@/lib/utils/prisma";
import {
  generateTOTPCode,
  generateTOTPSecret,
  TOTP_EXPIRATION_DURATION,
} from "@/lib/utils/totp";

export async function triggerEmailVerification(
  userId: string,
  email: string,
  update: boolean
) {
  // Generate secret for this user
  const secret = generateTOTPSecret();
  const code = generateTOTPCode(secret);

  // Store secret in db
  await prisma.tOTPSecret.upsert({
    where: { userId },
    update: {
      secret,
      expiresLe: new Date(Date.now() + TOTP_EXPIRATION_DURATION * 1000),
    },
    create: {
      userId: userId,
      secret,
      expiresLe: new Date(Date.now() + TOTP_EXPIRATION_DURATION * 1000),
    },
  });

  // Send the code via email
  if (update) {
    await sendEmailUpdateVerification(email, code);
  } else {
    await sendVerificationEmail(email, code);
  }
}

// Send verification email function
export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<void> {
  try {
    // Create the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Create the email content
    const mailOptions = {
      from: process.env.OUTLOOK_USER,
      to: email,
      subject: "Vérifiez votre compte",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2c3e50;">Bienvenue dans notre boutique !</h2>
          <p>Merci de vous être inscrit. Pour vérifier votre adresse e-mail, veuillez utiliser le code suivant :</p>
    
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #2c3e50;">${code}</h3>
          </div>
    
          <p>Ce code est valable pendant <strong>5 minutes</strong>. Si vous n'avez pas demandé cette vérification, veuillez ignorer cet e-mail.</p>
    
          <p>Merci,<br>L'équipe de notre boutique</p>
    
          <footer style="margin-top: 30px; font-size: 12px; color: #777;">
            Cet e-mail est généré automatiquement, merci de ne pas y répondre.
          </footer>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to: ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email.");
  }
}

// Send email update verification function
// This function sends a verification email when a user updates their email address.
export async function sendEmailUpdateVerification(
  email: string,
  code: string
): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.OUTLOOK_USER,
      to: email,
      subject: "Confirmez votre nouvelle adresse e-mail",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2c3e50;">Mise à jour de votre adresse e-mail</h2>
          <p>Vous avez récemment demandé à modifier l'adresse e-mail associée à votre compte.</p>
          
          <p>Pour confirmer cette nouvelle adresse, veuillez utiliser le code suivant :</p>

          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #2c3e50;">${code}</h3>
          </div>

          <p>Ce code est valable pendant <strong>5 minutes</strong>. Si vous n'avez pas demandé cette modification, vous pouvez ignorer cet e-mail.</p>

          <p>Merci,<br>L'équipe de notre boutique</p>

          <footer style="margin-top: 30px; font-size: 12px; color: #777;">
            Cet e-mail est généré automatiquement, merci de ne pas y répondre.
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email update verification sent to: ${email}`);
  } catch (error) {
    console.error("Error sending update verification email:", error);
    throw new Error("Failed to send email update verification.");
  }
}

// Send password reset email function
export async function sendPasswordResetEmail(
  email: string,
  code: string
): Promise<void> {
  try {
    // Create the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Create the email content
    const mailOptions = {
      from: process.env.OUTLOOK_USER,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2c3e50;">Demande de réinitialisation de mot de passe</h2>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Utilisez le code ci-dessous pour poursuivre le processus :</p>

          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #2c3e50;">${code}</h3>
          </div>

          <p>Ce code est valable pendant <strong>5 minutes</strong>. Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>

          <p>Merci,<br>L'équipe de notre boutique</p>

          <footer style="margin-top: 30px; font-size: 12px; color: #777;">
            Cet e-mail est généré automatiquement, merci de ne pas y répondre.
          </footer>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${email}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email.");
  }
}
