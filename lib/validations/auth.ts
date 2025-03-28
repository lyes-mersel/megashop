import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email("Veuillez entrer une adresse e-mail valide.")
    .transform((email) => email.toLowerCase()), // email en minuscules
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères."),
  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .transform(
      (nom) => nom.charAt(0).toUpperCase() + nom.slice(1).toLowerCase()
    ), // Capitaliser le nom
  prenom: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .transform(
      (prenom) => prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase()
    ), // Capitaliser le prénom
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Veuillez entrer une adresse e-mail valide.")
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email("Veuillez entrer une adresse e-mail valide.")
    .transform((email) => email.toLowerCase()),
  newPassword: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères."),
  code: z
    .string()
    .regex(/^\d{6}$/, "Le code doit contenir exactement 6 chiffres."),
});
