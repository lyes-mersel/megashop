# megashop

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/lyes-mersel/megashop.git
   cd megashop
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   In the root directory, create a `.env` file and add:

   ```plaintext
    # Local Development
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   NEXT_PUBLIC_API_URL="http://localhost:3000/api"

   # Production
   PROD_API_URL="https://project-megashop.vercel.app"
   PROD_BASE_URL="https://project-megashop.vercel.app/api"

    # Database Connection
    DATABASE_URL="postgresql://postgres.fallhpfxzcmhrvtticfn:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?connection_limit=200&pool_timeout=10"
    DATABASE_DIRECT_URL="postgresql://postgres.fallhpfxzcmhrvtticfn:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?connection_limit=200&pool_timeout=10"

    # Cloudinary Configuration
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dzmbj5d0b"
    NEXT_PUBLIC_CLOUDINARY_API_KEY="****"
    CLOUDINARY_API_SECRET="****"

    # Authentication
    AUTH_SECRET="****"

    # Email Configuration
    EMAIL_USER="noreply.megashop@gmail.com"
    EMAIL_APP_PASSWORD="****"

    # Default User Password
    DEFAULT_PASSWORD="****"
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

## MegaShop API Documentation

### Authentication ✅

- `POST   /api/auth/register` - Register a new user
- `POST   /api/auth/login` - User login
- `POST   /api/auth/logout` - User logout
- `POST   /api/auth/password/reset` - Reset user password
- `POST   /api/auth/password/send-reset-code` - Send a password reset code via email
- `POST   /api/auth/email/verify` - Verify user email
- `POST   /api/auth/email/update` - Verify user email after an update request
- `POST   /api/auth/email/send-verification-code` - Send an email verification code

### Uploads ✅

- `POST   /api/uploads/image` - Upload an image

### Products

- `GET    /api/products` - Get all products ✅
- `POST   /api/products` - Add a product ✅

---

- `GET    /api/products/search` - Search for products ✅

---

- `GET    /api/products/{productId}` - Get product by ID ✅
- `PATCH  /api/products/{productId}` - Update product details
- `DELETE /api/products/{productId}` - Delete a product

---

- `GET    /api/products/{productId}/reviews` - Retrieve product reviews
- `POST   /api/products/{productId}/reviews` - Add a review

---

- `GET    /api/products/{productId}/reviews/{reviewId}` - Retrieve a specific review
- `PUT    /api/products/{productId}/reviews/{reviewId}` - Update a review
- `DELETE /api/products/{productId}/reviews/{reviewId}` - Delete a review

---

- `GET    /api/products/{productId}/reviews/{reviewId}/responses` - Retrieve responses to a review
- `POST   /api/products/{productId}/reviews/{reviewId}/responses` - Respond to a review

---

- `GET    /api/products/{productId}/reviews/{reviewId}/responses/{responseId}` - Retrieve a specific response
- `PUT    /api/products/{productId}/reviews/{reviewId}/responses/{responseId}` - Update a response
- `DELETE /api/products/{productId}/reviews/{reviewId}/responses/{responseId}` - Delete a response

### Users

- `GET    /api/users/{userId}` - Retrieve a user ✅
- `PATCH  /api/users/{userId}` - Update a user ✅
- `DELETE /api/users/{userId}` - Delete a user ✅

---

- `GET    /api/users/{userId}/settings/address` - Retrieve a user address✅
- `PUT    /api/users/{userId}/settings/address` - Update a user address ✅
- `DELETE /api/users/{userId}/settings/address` - Delete a user address ✅

---

- `GET    /api/users/{userId}/settings/avatar` - Retrieve a user avatar ✅
- `PUT    /api/users/{userId}/settings/avatar` - Update a user avatar ✅
- `DELETE /api/users/{userId}/settings/avatar` - Delete a user avatar ✅

---

- `GET    /api/users/{userId}/settings/vendor-status` - Retrieve a vendor status details ✅
- `POST   /api/users/{userId}/settings/vendor-status` - Client becomes a vendor ✅
- `PUT    /api/users/{userId}/settings/vendor-status` - Update a vendor infos ✅

---

- `GET    /api/users/{userId}/profile` - Get a vendor public profile ✅

---

- `GET    /api/users/{userId}/notifications` - Retrieve all user notifications + (pagination & filters) ✅
- `PATCH  /api/users/{userId}/notifications` - Update all user notifications (statut estLu) ✅
- `DELETE /api/users/{userId}/notifications` - Delete all user notifications ✅

---

- `GET    /api/users/{userId}/notifications/{notifId}` - Retrieve a user notifications by ID ✅
- `PATCH  /api/users/{userId}/notifications/{notifId}` - Update a user notifications by ID ✅(statut estLu)
- `DELETE /api/users/{userId}/notifications/{notifId}` - Delete a user notifications by Id ✅

---

- `GET    /api/users/{userId}/orders` - Retrieve user orders
- `POST   /api/users/{userId}/orders` - Create an order

---

- `GET    /api/users/{userId}/orders/{orderId}` - Retrieve a specific order
- `PUT    /api/users/{userId}/orders/{orderId}` - Update an order
- `DELETE /api/users/{userId}/orders/{orderId}` - Delete an order

---

- `GET    /api/users/{userId}/cart` - Get user cart
- `POST   /api/users/{userId}/cart` - Add item to cart
- `PATCH  /api/users/{userId}/cart` - Update cart
- `DELETE /api/users/{userId}/cart` - Remove item from cart

---

- `GET    /api/users/{userId}/payments` - Retrieve user payments
- `GET    /api/users/{userId}/payments/{paymentId}` - Retrieve payment details
- `PUT    /api/users/{userId}/payments/{paymentId}` - Update payment details

### Admin

- `GET    /api/admin/analytics` - Get platform analytics

---

- `GET    /api/admin/users` - Get all users
- `POST   /api/admin/users` - Create a user
- `GET    /api/admin/users/{userId}` - Get a specific user
- `PATCH  /api/admin/users/{userId}` - Update a user
- `DELETE /api/admin/users/{userId}` - Delete a user

---

- `GET    /api/admin/reviews` - Get all product reviews
- `GET    /api/admin/reviews/{reviewId}` - Get a specific review
- `DELETE /api/admin/reviews/{reviewId}` - Delete a review

---

- `GET    /api/admin/reviews/{reviewId}/responses` - Get responses to a review
- `POST   /api/admin/reviews/{reviewId}/responses` - Add a response to a review
- `GET    /api/admin/reviews/{reviewId}/responses/{responseId}` - Get a specific response
- `PUT    /api/admin/reviews/{reviewId}/responses/{responseId}` - Update a response
- `DELETE /api/admin/reviews/{reviewId}/responses/{responseId}` - Delete a response

---

- `GET    /api/admin/reports` - Get all user reports
- `GET    /api/admin/reports/{reportId}` - Get a specific report
- `PATCH  /api/admin/reports/{reportId}` - Modify the status of a report
- `DELETE /api/admin/reports/{reportId}` - Delete a report

---

- `GET    /api/admin/notifications` - Get all notifications
- `POST   /api/admin/notifications` - Create a new notification
- `GET    /api/admin/notifications/{notifId}` - Get a specific notification
- `DELETE /api/admin/notifications/{notifId}` - Delete a notification

---

- `GET    /api/admin/orders` - Get all orders
- `GET    /api/admin/orders/{orderId}` - Get a specific order
- `PATCH  /api/admin/orders/{orderId}` - Update an order
- `DELETE /api/admin/orders/{orderId}` - Delete an order

---

- `GET    /api/admin/payments` - Get all payments
- `GET    /api/admin/payments/{paymentId}` - Get payment details
- `PATCH  /api/admin/payments/{paymentId}` - Update payment details
- `DELETE /api/admin/payments/{paymentId}` - Delete a payment

---

- `GET    /api/admin/products` - Get all products
- `GET    /api/admin/products/{productId}` - Get a specific product
- `PATCH  /api/admin/products/{productId}` - Update a product
- `DELETE /api/admin/products/{productId}` - Delete a product

---

- `GET    /api/admin/testimonials` - Get all testimonials
- `GET    /api/admin/testimonials/{testimonialId}` - Get a specific testimonial
- `PATCH  /api/admin/testimonials/{testimonialId}` - Update a testimonial
- `DELETE /api/admin/testimonials/{testimonialId}` - Delete a testimonial

---

- `GET    /api/admin/settings` - Get platform settings
- `PATCH  /api/admin/settings` - Update platform settings

### Testimonials

- `GET    /api/testimonials` - Get testimonials
- `GET    /api/testimonials/{testimonialId}` - Get a testimonial by ID
