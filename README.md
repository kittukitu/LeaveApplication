# my-userapp

**A modern Full-Stack React FBCA Application with User Management built with @voilajsx/uikit and @voilajsx/appkit**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database configuration

# Database setup
npx prisma generate
npx prisma db push
npm run db:seed

# Start development (both frontend and backend)
npm run dev

# Or start individually
npm run dev:web     # Frontend only (localhost:5173)
npm run dev:api     # Backend only (localhost:3000)

# Build for production
npm run build
npm run preview
```

## 🏗️ Full-Stack Architecture

This is a complete full-stack user management application featuring:

### 🎨 **Frontend (React + UIKit)**
- **37 UI Components** - Forms, tables, navigation, overlays, and more
- **5 Professional Themes** - Base, Elegant, Metro, Studio, Vivid
- **5 Layout Systems** - Admin, Auth, Page, Popup, Blank layouts
- **FBCA Architecture** - Scalable feature-based organization
- **Theme System** - Light/dark mode with semantic OKLCH colors
- **TypeScript Support** - Full type safety throughout

### 🔐 **Backend (Express + AppKit)**
- **Feature-Based API** - Modular route organization
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control** - Admin, moderator, user roles
- **Rate Limiting** - AppKit security protection
- **Password Security** - 8-character minimum, bcrypt hashing
- **Email Verification** - Account verification workflow
- **User Management** - Complete CRUD operations for users
- **PostgreSQL + Prisma** - Production-ready database setup

### 📊 **Database & Features**
- **Prisma ORM** - Type-safe database operations
- **User Model** - Complete user profile with roles/permissions
- **Authentication Flow** - Login, register, logout, password reset
- **Email Verification** - Secure account activation
- **Admin Panel** - User administration interface
- **Tenant Support** - Multi-tenant ready architecture

## 🗂️ Project Structure (FBCA)

```
my-userapp/
├── src/
│   ├── web/                    # Frontend React app
│   │   ├── features/          # Feature-based components
│   │   │   ├── auth/         # Authentication feature
│   │   │   ├── user/         # User management feature
│   │   │   └── main/         # Main application pages
│   │   ├── shared/           # Shared components & utilities
│   │   ├── lib/              # Core application logic
│   │   └── styles/           # Global styles & themes
│   └── api/                   # Backend Express server
│       ├── features/         # Feature-based API routes
│       │   ├── auth/        # Authentication endpoints
│       │   ├── user/        # User management endpoints
│       │   └── welcome/     # Welcome/health endpoints
│       └── lib/             # Server utilities & middleware
├── prisma/                   # Database schema & migrations
│   ├── schema.prisma        # Database schema
│   └── seeding/            # Database seed files
└── docs/                    # Documentation & guides
```

## 🔑 Environment Setup

Copy `.env.example` to `.env` and configure:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/my-userapp"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend Configuration
VITE_API_URL=http://localhost:3000
```

## 📱 Features Available

### Authentication
- ✅ User Registration with email verification
- ✅ Login/Logout with JWT tokens
- ✅ Password reset functionality
- ✅ Role-based access control (admin, moderator, user)
- ✅ Secure password hashing with bcrypt

### User Management
- ✅ User profile management
- ✅ Admin user administration
- ✅ User roles and permissions
- ✅ Account activation/deactivation
- ✅ User search and filtering

### UI Components
- ✅ Responsive authentication forms
- ✅ User management tables
- ✅ Admin dashboard
- ✅ Theme switching (light/dark)
- ✅ Professional layouts

## 🚀 Development Commands

```bash
# Development
npm run dev          # Start both frontend and backend
npm run dev:web      # Frontend only (React + Vite)
npm run dev:api      # Backend only (Express + tsx)

# Database
npm run db:generate  # Generate Prisma client
npm run db:push     # Push schema changes to database
npm run db:reset    # Reset database (dev only)
npm run db:seed     # Seed database with sample data

# Production
npm run build       # Build both frontend and backend
npm run start       # Start production server
npm run preview     # Preview production build

# Code Quality
npm run lint        # ESLint code checking
npm run typecheck   # TypeScript type checking
```

## 🎯 Default Admin Account

After running `npm run db:seed`, you can login with:
- **Email**: admin@example.com
- **Password**: admin123

## 📚 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt
- **UI Framework**: @voilajsx/uikit (37+ components)
- **Backend Framework**: @voilajsx/appkit (FBCA architecture)
- **Development**: tsx, ESLint, concurrent development

## 🔗 Key Features

1. **Complete User Management System** - Registration, login, profile management
2. **Admin Panel** - User administration with role management
3. **Secure Authentication** - JWT tokens, password hashing, email verification
4. **Modern UI/UX** - Professional themes, responsive design, accessibility
5. **Production Ready** - TypeScript, error handling, security best practices
6. **FBCA Architecture** - Scalable, maintainable feature-based structure

Built with ❤️ using Helix Framework