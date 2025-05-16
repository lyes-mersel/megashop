import { z } from "zod";

// Define payment data schema
export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(12)
    .max(19)
    .regex(/^\d+$/, "Card number must be digits"),
  cvc: z.string().min(3).max(4).regex(/^\d+$/, "CVC must be digits"),
  expirationDate: z.string().regex(/^\d{2}\/\d{2}$/, "Format must be MM/YY"),
  legalName: z.string().min(1, "Legal name is required"),
});
