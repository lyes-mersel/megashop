# MEGA SHOP

## API Documentation

### Authentication

- `POST   /api/auth/register` - Register a new user (public) ✅
- `POST   /api/auth/login` - User login (public) ✅
- `POST   /api/auth/logout` - User logout (public) ✅
- `POST   /api/auth/password/reset` - Reset user password (public) ✅
- `POST   /api/auth/password/send-reset-code` - Send a password reset code via email (public) ✅
- `POST   /api/auth/email/verify` - Verify user email (private) ✅
- `POST   /api/auth/email/update` - Verify user email after an update request (private) ✅
- `POST   /api/auth/email/send-verification-code` - Send an email verification code (private) ✅

### Uploads

- `POST   /api/uploads/image` - Upload an image (admin) ✅

### Products

- `GET    /api/products` - Get all products (public) ✅
- `POST   /api/products` - Add a new product (admin|vendor) ✅
- `DELETE /api/products` - Delete all products (admin|vendor) ✅
- `GET    /api/products/search` - Search for products (public) ✅
- `GET    /api/products/mine` - Search for my products (vendor) ✅

---

- `GET    /api/products/{productId}` - Get product by ID (public) ✅
- `PATCH  /api/products/{productId}` - Update product details (admin|vendor) ✅
- `DELETE /api/products/{productId}` - Delete a product by ID (admin|vendor) ✅
- `OP     /api/products/{productId}/images` - Add operations for a product images (Later)

## Reviews

- `GET    /api/reviews?productId` - Retrieve a product reviews (public) ✅
- `POST   /api/reviews?productId` - Add a review to a product (private) ✅
- `DELETE /api/reviews?productId` - Delete all reviews of a product (admin) ✅
- `GET    /api/reviews/{reviewId}` - Retrieve a specific review (public) ✅
- `PUT    /api/reviews/{reviewId}` - Update a review (concernedUser) ✅
- `DELETE /api/reviews/{reviewId}` - Delete a review (admin|concernedUser) ✅

---

- `GET    /api/reviews/{reviewId}/responses` - Retrieve responses to a review (public) ✅
- `POST   /api/reviews/{reviewId}/responses` - Respond to a review (admin|productVendor) ✅
- `DELETE /api/reviews/{reviewId}/responses` - Delete all responses (admin) ✅
- `GET    /api/reviews/{reviewId}/responses/{responseId}` - Retrieve a specific response (public) ✅
- `PUT    /api/reviews/{reviewId}/responses/{responseId}` - Update a response (concernedUser) ✅
- `DELETE /api/reviews/{reviewId}/responses/{responseId}` - Delete a response (admin|concernedUser)✅

### Users

- `GET    /api/admin/users` - Get all users (admin) ✅
- `DELETE /api/admin/users` - Delete all users (admin) ✅
- `GET    /api/users/{userId}` - Retrieve a user (admin|concernedUser) ✅
- `PATCH  /api/users/{userId}` - Update a user (concernedUser) ✅
- `DELETE /api/users/{userId}` - Delete a user (admin|concernedUser) ✅

---

- `GET    /api/users/{userId}/settings/address` - Get a user address (concernedUser)✅
- `PUT    /api/users/{userId}/settings/address` - Update a user address (concernedUser) ✅
- `DELETE /api/users/{userId}/settings/address` - Delete a user address (concernedUser) ✅

---

- `GET    /api/users/{userId}/settings/avatar` - Retrieve a user avatar (concernedUser) ✅
- `PUT    /api/users/{userId}/settings/avatar` - Update a user avatar (concernedUser) ✅
- `DELETE /api/users/{userId}/settings/avatar` - Delete a user avatar (concernedUser) ✅

---

- `GET    /api/users/{userId}/settings/vendor-status` - Get a vendor status details (concernedUser)✅
- `POST   /api/users/{userId}/settings/vendor-status` - Client becomes a vendor (concernedUser) ✅
- `PATCH  /api/users/{userId}/settings/vendor-status` - Update a vendor infos (concernedUser) ✅

---

- `GET    /api/users/{userId}/profile` - Get a vendor public profile (public) ✅

---

- `GET    /api/users/{userId}/notifications` - Retrieve all user notifications (concernedUser) ✅
- `PATCH  /api/users/{userId}/notifications` - Update all user notifications (concernedUser) ✅
- `DELETE /api/users/{userId}/notifications` - Delete all user notifications (concernedUser) ✅

---

- `GET    /api/users/{userId}/notifications/{notifId}` - Retrieve a notif by ID (concernedUser) ✅
- `PATCH  /api/users/{userId}/notifications/{notifId}` - Update a notif by ID (concernedUser) ✅
- `DELETE /api/users/{userId}/notifications/{notifId}` - Delete a notif by Id (concernedUser) ✅

---

- `GET    /api/users/{userId}/orders` - Retrieve user orders (concernedUser) ✅
- `GET    /api/users/{userId}/orders/{orderId}` - Retrieve a specific order (concernedUser) ✅

---

- `GET    /api/users/{userId}/cart` - Get user cart
- `POST   /api/users/{userId}/cart` - Add item to cart
- `PATCH  /api/users/{userId}/cart` - Update cart
- `DELETE /api/users/{userId}/cart` - Remove item from cart

### Orders

- `GET    /api/orders` - Get all orders (admin)
- `GET    /api/orders/{orderId}` - Get a specific order (admin)
- `PATCH  /api/orders/{orderId}` - Update an order (admin)
- `DELETE /api/orders/{orderId}` - Delete an order (admin)

### Reports

- `GET    /api/reports` - Get all user reports (admin)
- `GET    /api/reports/{reportId}` - Get a specific report (admin)
- `PATCH  /api/reports/{reportId}` - Modify the status of a report (admin)
- `DELETE /api/reports/{reportId}` - Delete a report (admin)

### Payments

- `GET    /api/payments` - Get all payments (admin)
- `GET    /api/payments/{paymentId}` - Get payment details (admin)
- `PATCH  /api/payments/{paymentId}` - Update payment details (admin)
- `DELETE /api/payments/{paymentId}` - Delete a payment (admin)

### Testimonials

- `GET    /api/testimonials` - Get testimonials
- `POST   /api/testimonials` - Get testimonials (for admin)
- `GET    /api/testimonials/{testimonialId}` - Get a testimonial by ID
- `PATCH  /api/admin/testimonials/{testimonialId}` - Update a testimonial (for admin)
- `DELETE /api/admin/testimonials/{testimonialId}` - Delete a testimonial (for admin)

### Analytics

- `GET    /api/analytics` - Get analytics (for vendor and admin)
- `POST   /api/analytics/cron` - An endpoint that should be triggered daily to generate analytics.

### Metadata

- `GET    /api/metadata/categories` - Get all categories (admin|vendor) ✅
- `GET    /api/metadata/colors` - Get all colors (admin|vendor) ✅
- `GET    /api/metadata/genders` - Get all genders (admin|vendor) ✅
- `GET    /api/metadata/sizes` - Get all categories (admin|vendor) ✅
