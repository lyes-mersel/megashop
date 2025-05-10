import {
  ALLOWED_IMAGE_FORMATS,
  MAX_UPLOAD_SIZE_MB,
} from "@/lib/constants/settings";
import { z } from "zod";

export const updateUserSchema = z
  .object({
    email: z.string().email("Email invalide").optional(),
    currentPassword: z.string().optional(),
    newPassword: z
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
  .strict()
  .refine(
    (data) =>
      (!data.newPassword && !data.currentPassword) ||
      (data.newPassword && data.currentPassword),
    {
      message:
        "Les champs 'mot de passe actuel' et 'nouveau mot de passe' doivent être fournis ensemble.",
      path: ["newPassword"],
    }
  );

// Schema for updating user address
export const updateAddressSchema = z.object({
  rue: z.string().min(1, "La rue est requise."),
  ville: z.string().min(1, "La ville est requise."),
  wilaya: z.string().min(1, "La wilaya est requise."),
  codePostal: z.string().min(4, "Code postal invalide."),
});

// Schema for updating user avatar
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

// Schema for becoming a vendor
export const becomeVendorSchema = z.object({
  nomBoutique: z.string().min(1, "Nom boutique requis"),
  description: z.string().optional(),
  nomBanque: z.string().min(1, "Nom banque requis"),
  rib: z.string().min(1, "RIB requis"),
});

// Partial update schema for PATCH
export const updateVendorSchema = z
  .object({
    nomBoutique: z.string().max(100).optional(),
    description: z.string().max(1000).optional(),
    nomBanque: z.string().max(50).optional(),
    rib: z.string().max(50).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être renseigné.",
  });
