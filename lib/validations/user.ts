import { z } from "zod";

export const updateUserSchema = z
  .object({
    email: z.string().email("Email invalide").optional(),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères")
      .optional(),
    nom: z.string().min(1, "Le nom est requis").optional(),
    prenom: z.string().min(1, "Le prénom est requis").optional(),
    tel: z
      .string()
      .regex(/^[0-9+\-().\s]{7,20}$/, "Numéro de téléphone invalide")
      .optional(),
  })
  .strict();
