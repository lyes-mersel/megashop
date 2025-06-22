# MEGA SHOP 🛍️

[![Academic Project](https://img.shields.io/badge/Academic%20Project-Master%201%20Software%20Engineering-blue?style=for-the-badge&logo=graduation-cap)](https://www.univ-bejaia.dz/)

A modern, full-stack e-commerce platform built with Next.js 15, featuring a comprehensive marketplace with multi-vendor support, real-time chat, and advanced analytics.

## ✨ Features

### 🛒 Customer Features

- **Product Catalog**: Browse products with advanced filtering and search
- **Shopping Cart**: Persistent cart with real-time updates
- **Order Management**: Track orders with real-time status updates
- **Product Reviews**: Rate and review products with photo uploads
- **Wishlist**: Save favorite products for later
- **Real-time Chat**: Get instant support from vendors
- **Email Verification**: Secure account creation with email verification
- **Password Reset**: Secure password recovery system

### 🏪 Vendor Features

- **Store Management**: Create and manage your own store
- **Product Management**: Add, edit, and manage product inventory
- **Order Processing**: Handle customer orders with status updates
- **Sales Analytics**: Track sales performance and revenue
- **Payment Tracking**: Monitor payment status and history
- **Customer Support**: Chat with customers in real-time

### 👨‍💼 Admin Features

- **User Management**: Manage customers, vendors, and admins
- **Store Oversight**: Monitor and manage all vendor stores
- **Order Management**: Oversee all platform orders
- **Analytics Dashboard**: Comprehensive platform analytics
- **Report Management**: Handle user reports and disputes
- **System Notifications**: Send platform-wide announcements

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend

- **Next.js API Routes** - Server-side API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication system
- **Nodemailer** - Email service

### External Services

- **Cloudinary** - Image and file storage
- **OpenRouter AI** - AI-powered chat support
- **Supabase** - Database hosting

### UI Components

- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **Embla Carousel** - Carousel component

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Git**

## 🚀 Installation

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

   Create a `.env` file in the root directory:

   ```env
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

   # Chatbot OpenRouter API Key
   OPENROUTER_API_KEY="****"

   # Email Configuration
   EMAIL_USER="noreply.megashop@gmail.com"
   EMAIL_APP_PASSWORD="****"

   # Default User Password
   DEFAULT_PASSWORD="****"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Seed the database with initial data
   npx prisma db seed
   ```

5. **Run the Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Customers, vendors, and admins
- **Products**: Product catalog with variants
- **Orders**: Order management and tracking
- **Carts**: Shopping cart functionality
- **Reviews**: Product reviews and ratings
- **Notifications**: System notifications
- **Reports**: User reports and disputes

## 🏗️ Project Structure

```text
megashop/
├── app/                    # Next.js App Router
│   ├── (portal)/           # Admin, vendor, and client portals
│   ├── (store)/            # Public store pages
│   ├── api/                # API routes
│   └── auth/               # Authentication pages
├── components/             # Reusable UI components
│   ├── auth/               # Authentication components
│   ├── common/             # Shared components
│   ├── layout/             # Layout components
│   ├── portal/             # Portal-specific components
│   ├── store/              # Store-specific components
│   └── ui/                 # Base UI components
├── lib/                    # Utility libraries
│   ├── auth/               # Authentication utilities
│   ├── helpers/            # Helper functions
│   ├── types/              # TypeScript type definitions
│   └── validations/        # Form validations
├── prisma/                 # Database schema and migrations
├── redux/                  # State management
└── styles/                 # Global styles
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Run database migrations
- `npx prisma db seed` - Seed database with initial data

## 🔐 Authentication

The application uses NextAuth.js with the following authentication methods:

- Email/Password authentication
- Email verification
- Password reset functionality
- Role-based access control (Customer, Vendor, Admin)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 About This Project

**MEGA SHOP © 2025** – Academic project developed by Master 1 Software Engineering students from the University of Béjaïa. This project serves as a comprehensive e-commerce solution that demonstrates modern web development practices, full-stack architecture, and real-world application development skills.

**🏫 Institution:** University of Béjaïa  
**📖 Program:** Master 1 Software Engineering  
**👥 Team:** 4 students  
**📅 Year:** 2025  
**👨‍🏫 Supervisor:** Mr Z.Farah

## 👨‍💻 Development Team

- **MERSEL Lyes** - [@lyes-mersel](https://github.com/lyes-mersel)
- **BRAHIMI Rayan** - [@BrahimiRayan](https://github.com/BrahimiRayan)
- **MECHKOUR Billal** - [@Billalmechekour](https://github.com/Billalmechekour)
- **MESSAOUDENE Saïd** - [@Messaoudene-Said](https://github.com/Messaoudene-Said)

## 📖 API Documentation

For detailed API documentation, please refer to the [API Documentation README](docs/api.md).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**MEGA SHOP** - Your complete e-commerce solution! 🛍️✨
