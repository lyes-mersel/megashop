import { z } from "zod";

// Schéma de validation des paiements
export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(12, "Min. 12 chiffres")
    .max(19, "Max. 19 chiffres")
    .regex(/^\d+$/, "Chiffres uniquement"),
  cvc: z
    .string()
    .min(3, "Min. 3 chiffres")
    .max(4, "Max. 4 chiffres")
    .regex(/^\d+$/, "Chiffres uniquement"),
  expirationDate: z.string().regex(/^\d{2}\/\d{2}$/, "Format MM/AA"),
  legalName: z.string().min(1, "Nom requis"),
});
