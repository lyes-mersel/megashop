import { registerSchema, loginSchema, resetPasswordSchema } from "./auth";
import { productSchema, updateProductSchema } from "./product";
import {
  reviewSchema,
  updateReviewSchema,
  reviewResponseSchema,
} from "@/lib/validations/review";
import {
  updateUserSchema,
  updateAddressSchema,
  updateUserAvatarSchema,
  becomeVendorSchema,
  updateVendorSchema,
} from "./user";
import {
  createOrderSchema,
  prepareOrderSchema,
  fullOrderWithPaymentSchema,
} from "./order";
import { reportSchema } from "@/lib/validations/report";

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
  reviewResponseSchema,

  // User
  updateUserSchema,
  updateAddressSchema,
  updateUserAvatarSchema,
  becomeVendorSchema,
  updateVendorSchema,

  // Order
  createOrderSchema,
  prepareOrderSchema,
  fullOrderWithPaymentSchema,

  // Report
  reportSchema,

  // Format validation errors
  formatValidationErrors,
};
