import { registerSchema, loginSchema, resetPasswordSchema } from "./auth";
import { productSchema, updateProductSchema } from "./product";
import {
  reviewSchema,
  updateReviewSchema,
  reviewReplySchema,
} from "@/lib/validations/review";
import {
  updateUserSchema,
  updateAddressSchema,
  updateUserAvatarSchema,
  becomeVendorSchema,
  updateVendorSchema,
} from "./user";
import formatValidationErrors from "./formatValidationErrors";

export {
  // Auth
  registerSchema,
  loginSchema,
  resetPasswordSchema,

  // Product
  productSchema,
  updateProductSchema,

  // Review
  reviewSchema,
  updateReviewSchema,
  reviewReplySchema,

  // User
  updateUserSchema,
  updateAddressSchema,
  updateUserAvatarSchema,
  becomeVendorSchema,
  updateVendorSchema,

  // Format validation errors
  formatValidationErrors,
};
