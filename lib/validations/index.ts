import { registerSchema, loginSchema, resetPasswordSchema } from "./auth";
import { productSchema } from "./product";
import {
  updateUserSchema,
  updateAddressSchema,
  updateUserAvatarSchema,
} from "./user";
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
  updateAddressSchema,
  updateUserAvatarSchema,

  // Format validation errors
  formatValidationErrors,
};
