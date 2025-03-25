import nodemailer from "nodemailer";

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
