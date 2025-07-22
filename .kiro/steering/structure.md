# Project Structure & Organization

## Directory Structure

### Core Directories

- `/app`: Next.js App Router pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility libraries and shared code
- `/prisma`: Database schema and migrations
- `/public`: Static assets
- `/hooks`: Custom React hooks
- `/types`: TypeScript type definitions
- `/utils`: Helper functions and utilities

### App Directory Structure

- `/app/api`: API routes organized by domain and role
- `/app/admin`: Admin dashboard and management pages
- `/app/client`: Student/external user pages
- `/app/coordinador`: Coordinator pages
- `/app/empresa`: Company pages
- `/app/login`: Authentication pages
- `/app/signup`: Registration pages

## Naming Conventions

### Files and Folders

- Use kebab-case for directories and files in the app router
- Use PascalCase for React components
- Use camelCase for utility functions and hooks
- Use `.tsx` extension for React components
- Use `.ts` extension for TypeScript files without JSX

### API Routes

- Organized by role and domain: `/api/[role]/[resource]`
- Use HTTP methods (GET, POST, PUT, DELETE) for CRUD operations
- Dynamic routes use square brackets: `/api/vacantes/[id]/route.ts`

## Data Flow Architecture

### API Pattern

- API routes use Next.js Route Handlers
- Each route file exports HTTP method handlers (GET, POST, etc.)
- Authentication handled via NextAuth middleware
- Database access via Prisma client

### Component Structure

- UI components in `/components/ui`
- Feature-specific components at the root of `/components`
- Page components in the appropriate `/app` directory
- Custom hooks in `/hooks` directory

## Database Structure

### Schema Organization

- Main schema in `/prisma/schema.prisma`
- Model-specific schema files in `/prisma/models/`
- Migrations in `/prisma/migrations/`

### Key Models

- `User`: Student and external user accounts
- `Company`: Company profiles and accounts
- `Vacante`: Job postings
- `Application`: Job applications
- `Survey`: Performance evaluation surveys
- `Role`: User role definitions

## Authentication & Authorization

- NextAuth.js for authentication
- Role-based access control via middleware
- Protected routes based on user role
- Company approval workflow for new registrations

## File Upload System

- CV uploads stored in `/public/uploads/cvs/`
- API endpoints for file management in `/api/uploads/`
- File naming convention: `cv_{userId}_{timestamp}.pdf`
