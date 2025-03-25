import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
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
      async authorize(credentials) {
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
          image: user.urlImage,
          role: user.role,
          emailVerifie: user.emailVerifie ?? false,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "signIn" && user) {
        token.id = user.id!;
        token.email = user.email;
        token.picture = user.image;
        token.role = user.role;
        token.emailVerifie = user.emailVerifie;
      }

      if (trigger === "update" && session?.user?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            email: true,
            urlImage: true,
            role: true,
            emailVerifie: true,
          },
        });

        if (dbUser) {
          token.email = dbUser.email;
          token.picture = dbUser.urlImage;
          token.role = dbUser.role;
          token.emailVerifie = dbUser.emailVerifie;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id!;
      session.user.email = token.email!;
      session.user.image = token.picture;
      session.user.role = token.role;
      session.user.emailVerifie = token.emailVerifie;
      return session;
    },
  },
});
