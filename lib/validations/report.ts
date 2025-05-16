import { z } from "zod";

export const reportSchema = z.object({
  objet: z
    .string()
    .max(255, { message: "L'objet ne peut pas dépasser 255 caractères" }),
  text: z
    .string()
    .max(1000, { message: "Le texte ne peut pas dépasser 1000 caractères" })
    .optional(),
  produitId: z
    .string({ required_error: "L'ID du produit est requis" })
    .min(1, { message: "L'ID du produit ne peut pas être vide" }),
});
