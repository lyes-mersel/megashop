import "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      role: UserRole;
      emailVerifie: boolean;
      imagePublicId: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    role: UserRole;
    emailVerifie: boolean;
    imagePublicId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: UserRole;
    emailVerifie: boolean;
    imagePublicId: string | null;
  }
}
