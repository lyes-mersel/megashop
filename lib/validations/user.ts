import {
  ALLOWED_IMAGE_FORMATS,
  MAX_UPLOAD_SIZE_MB,
} from "@/lib/constants/settings";
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

export const updateAddressSchema = z.object({
  rue: z.string().min(1, "La rue est requise."),
  ville: z.string().min(1, "La ville est requise."),
  wilaya: z.string().min(1, "La wilaya est requise."),
  codePostal: z.string().min(4, "Code postal invalide."),
});

export const updateUserAvatarSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => ALLOWED_IMAGE_FORMATS.includes(file.type), {
      message: "Format d'image non supporté.",
    })
    .refine((file) => file.size <= MAX_UPLOAD_SIZE_MB * 1024 * 1024, {
      message: `L'image ne doit pas dépasser ${MAX_UPLOAD_SIZE_MB} Mo.`,
    }),
});
