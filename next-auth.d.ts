import "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    role?: UserRole | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string | null;
    role?: UserRole | null;
  }
}
