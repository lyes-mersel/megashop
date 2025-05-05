# MEGA SHOP

## API Documentation

- [View API Documentation](docs/api.md)

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
    DATABASE_URL="postgresql://postgres.fallhpfxzcmhrvtticfn:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=200&pool_timeout=10"
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
