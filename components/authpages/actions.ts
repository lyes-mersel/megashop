// "use server";

// import { prisma } from "@/lib/utils/prisma";
// import { sendVerificationEmail } from "@/lib/utils/sendEmail";
// import {
//   generateTOTPCode,
//   generateTOTPSecret,
//   TOTP_EXPIRATION_DURATION,
// } from "@/lib/utils/totp";
// import { User } from "next-auth";

// export async function sendVerificationEmailAction(user: User) {
//   try {
//     // Generate secret for this user
//     const secret = generateTOTPSecret();
//     const code = generateTOTPCode(secret);

//     // Store secret in db
//     await prisma.tOTPSecret.upsert({
//       where: { userId: user.id },
//       update: {
//         secret,
//         expiresLe: new Date(Date.now() + TOTP_EXPIRATION_DURATION * 1000),
//       },
//       create: {
//         userId: user.id as string,
//         secret,
//         expiresLe: new Date(Date.now() + TOTP_EXPIRATION_DURATION * 1000),
//       },
//     });

//     // Send the code via email
//     await sendVerificationEmail(user.email!, code);
//   } catch (error: unknown) {
//     console.error(error);
//   }
// }
