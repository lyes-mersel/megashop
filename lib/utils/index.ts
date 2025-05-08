import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Prisma } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function compareArrays(a: unknown[], b: unknown[]) {
  return a.toString() === b.toString();
}

export function isMySQL(): boolean {
  return process.env.DATABASE_URL?.includes("mysql") ?? false;
}

export function containsFilter(value: string) {
  return isMySQL()
    ? { contains: value }
    : { contains: value, mode: Prisma.QueryMode.insensitive };
}

export function extractDateString(dateInput: Date | string): string {
  const date = new Date(dateInput);
  return date.toLocaleDateString("fr-FR");
}

export const getImageUrlFromPublicId = (imagePublicId: string) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const defaultTransformations = "f_auto,q_auto";

  return `https://res.cloudinary.com/${cloudName}/image/upload/${defaultTransformations}/${imagePublicId}`;
};
