import { registerSchema, loginSchema, resetPasswordSchema } from "./auth";
import { productSchema } from "./product";
import { updateUserSchema } from "./user";
import formatValidationErrors from "./formatValidationErrors";

export {
  // Auth
  registerSchema,
  loginSchema,
  resetPasswordSchema,

  // Product
  productSchema,

  // User
  updateUserSchema,

  // Format validation errors
  formatValidationErrors,
};
