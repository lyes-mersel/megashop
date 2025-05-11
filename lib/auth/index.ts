import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import NextAuth, { type Session, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/utils/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) throw new Error("No user found!");

        // Check password
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) throw new Error("Invalid password!");

        // Return user object (NextAuth creates session)
        return {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
          emailVerifie: user.emailVerifie,
          imagePublicId: user.imagePublicId,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({
      token,
      user,
      session,
      trigger,
    }: {
      token: JWT;
      user: User;
      session?: Session;
      trigger?: "signIn" | "signUp" | "update";
    }): Promise<JWT> {
      // If the user is signing in, add user data to the token
      if (trigger === "signIn" && user) {
        token.id = user.id!;
        token.email = user.email!;
        token.nom = user.nom;
        token.prenom = user.prenom;
        token.role = user.role;
        token.emailVerifie = user.emailVerifie;
        token.imagePublicId = user.imagePublicId;
      }

      // If the user is updating their session, fetch the latest user data
      if (trigger === "update" && session?.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            id: true,
            email: true,
            nom: true,
            prenom: true,
            role: true,
            emailVerifie: true,
            imagePublicId: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.nom = dbUser.nom;
          token.prenom = dbUser.prenom;
          token.role = dbUser.role;
          token.emailVerifie = dbUser.emailVerifie;
          token.imagePublicId = dbUser.imagePublicId;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.nom = token.nom;
      session.user.prenom = token.prenom;
      session.user.role = token.role;
      session.user.emailVerifie = token.emailVerifie;
      session.user.imagePublicId = token.imagePublicId;
      return session;
    },
  },
});
