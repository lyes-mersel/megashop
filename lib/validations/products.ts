import { z } from "zod";

// Définition du schéma de validation Zod pour un produit
export const productSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  objet: z.string().max(255, "L'objet est trop long").optional(),
  description: z
    .string()
    .max(1000, "La description est trop longue")
    .optional(),
  prix: z
    .number({ invalid_type_error: "Le prix doit être un nombre" })
    .min(0, "Le prix ne peut pas être négatif"),
  qteStock: z
    .number({ invalid_type_error: "La quantité doit être un entier" })
    .int()
    .min(0, "La quantité ne peut pas être négative"),
  categorieId: z
    .string()
    .max(25, "L'ID de la catégorie est invalide")
    .optional(),
  genreId: z.string().max(25, "L'ID du genre est invalide").optional(),
  couleurs: z
    .array(z.string().max(25, "L'ID de la couleur est invalide"))
    .optional(),
  tailles: z
    .array(z.string().max(25, "L'ID de la taille est invalide"))
    .optional(),
});
