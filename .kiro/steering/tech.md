# Technical Stack & Development Guidelines

## Core Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database ORM**: Prisma 6 (splitted schemas on different files in models folder)
- **Database**: MySQL
- **Authentication**: NextAuth.js with Google OAuth (for general users) and Credentials providers (used only for companies)
- **UI Components**: Custom components built with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React Hooks and Context API

## Key Libraries

- **UI Components**: Radix UI (@radix-ui/\*)
- **Icons**: Lucide React
- **Date Handling**: date-fns and dayjs
- **Form Validation**: Native validation
- **Notifications**: Sonner
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Password Hashing**: bcryptjs
- **Email**: nodemailer

## Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Database Management**: Prisma Studio

## Common Commands

### Development

```bash
# Start development server with Turbopack
npm run dev

# Lint code
npm run lint
```

### Database Operations

```bash
# Generate Prisma client
npm run generate
# or
npx prisma generate

# Reset database (caution: deletes all data)
npm run prisma:reset
# or
npx prisma migrate reset

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Push schema changes without migration
npx prisma db push

# Open Prisma Studio (database UI)
npx prisma studio
```

### Build & Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Environment Setup

Required environment variables:

- `DATABASE_URL`: MySQL connection string
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: Base URL for NextAuth.js callbacks

## Code Style Conventions

- Use TypeScript for all new files
- Follow the existing folder structure for new features
- Use named exports instead of default exports when possible
- Prefer functional components with hooks over class components
- Use server components where possible, client components when needed
- Follow the API route naming conventions for consistency
