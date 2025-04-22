import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.string().min(1, { message: "Le produit est requis" }),
  note: z.number().min(0.5).max(5).multipleOf(0.5),
  text: z.string().min(1).max(500).optional(),
});

export const updateReviewSchema = z.object({
  note: z.number().min(0.5).max(5).multipleOf(0.5),
  text: z.string().min(1).max(500).optional(),
});

export const reviewResponseSchema = z.object({
  text: z
    .string({
      required_error: "Le texte est requis.",
    })
    .min(1, "Le texte ne peut pas être vide.")
    .max(500, "Le texte ne peut pas dépasser 500 caractères."),
});
