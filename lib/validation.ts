import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()), // Convert email to lowercase
  password: z.string(),
});

export const registerSchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()), // Convert email to lowercase
  password: z.string().min(6, "Password must be at least 6 characters"),
  nom: z
    .string()
    .min(2)
    .transform(
      (nom) => nom.charAt(0).toUpperCase() + nom.slice(1).toLowerCase()
    ), // Capitalize nom
  prenom: z
    .string()
    .min(2)
    .transform(
      (prenom) => prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase()
    ), // Capitalize prenom
});
