# UPQROO Bolsa de Trabajo - API Documentation

## Overview

This document provides comprehensive information about the UPQROO University Job Board Platform API. The API is built with Next.js 15 App Router and provides endpoints for managing users, companies, job vacancies, applications, and surveys.

## Base URL

```
http://localhost:3000 (Development)
https://your-domain.com (Production)
```

## Authentication

The API uses NextAuth.js for authentication with the following providers:

- **Google OAuth**: For students and external users (identified by @upqroo.edu.mx email domain)
- **Credentials**: For companies using email/password authentication

### Authentication Flow

1. **Students/External Users**: Use Google OAuth through `/api/auth/signin`
2. **Companies**: Use credentials authentication through `/api/auth/signin`
3. **Session Management**: Sessions are managed via HTTP-only cookies

### Authorization Levels

- **Public**: No authentication required
- **Authenticated**: Requires valid session
- **Role-based**: Requires specific user role (student, company, coordinator, admin)

## User Roles

| Role          | Description                      | Access Level                          |
| ------------- | -------------------------------- | ------------------------------------- |
| `student`     | UPQROO students (@upqroo.edu.mx) | Can apply to jobs, manage CV          |
| `external`    | Non-UPQROO users                 | Can apply to jobs, manage CV          |
| `company`     | Employers                        | Can post jobs, manage applications    |
| `coordinator` | University staff                 | Can approve companies, manage surveys |
| `admin`       | System administrators            | Full system access                    |

## API Endpoints Overview

### Authentication Endpoints

- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Job Vacancies

- `GET /api/vacantes` - List job vacancies with filters
- `POST /api/vacantes` - Create new job vacancy (admin/coordinator)
- `GET /api/vacantes/{id}` - Get job vacancy details
- `PUT /api/vacantes/{id}` - Update job vacancy
- `DELETE /api/vacantes/{id}` - Delete job vacancy

### Applications

- `GET /api/applications` - Get user applications or check status
- `POST /api/applications` - Apply to job vacancy

### Company Management

- `POST /api/company/register` - Register new company
- `GET /api/company/me` - Get company profile
- `PUT /api/company/me` - Update company profile
- `GET /api/empresa/vacantes` - Get company's job postings
- `POST /api/empresa/vacantes` - Create job posting
- `GET /api/empresa/dashboard` - Company dashboard data

### User Management

- `GET /api/usuarios` - List all users (admin/coordinator)
- `POST /api/usuarios` - Create new user (admin)
- `GET /api/usuarios/me` - Get current user profile
- `PUT /api/usuarios/me` - Update user profile

### Coordinator Functions

- `GET /api/coordinador/companies` - List companies for approval
- `PUT /api/coordinador/companies/{id}` - Approve/reject company
- `GET /api/coordinador/dashboard` - Coordinator dashboard
- `GET /api/coordinador/surveys` - Manage surveys
- `POST /api/coordinador/surveys` - Create new survey

### File Uploads

- `GET /api/uploads/cvs/{filename}` - Download CV with authorization
- `POST /api/uploads/logos` - Upload company logo
- `POST /api/usuarios/me/cv` - Upload user CV
- `DELETE /api/usuarios/me/cv` - Delete user CV

### Surveys

- `GET /api/empresa/surveys` - Get available surveys for company
- `POST /api/empresa/surveys/{id}` - Submit survey response

### Utilities

- `GET /api/states` - Get list of Mexican states
- `GET /api/health` - API health check
- `POST /api/mail` - Send email notifications

## Request/Response Format

### Content Types

- **Request**: `application/json` or `multipart/form-data` (for file uploads)
- **Response**: `application/json`

### Standard Response Format

#### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

#### Error Response

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

### HTTP Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

## Data Models

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "student" | "external" | "coordinator" | "admin";
  cvUrl?: string;
  career?: string;
  semester?: number;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Company

```typescript
interface Company {
  id: string;
  name: string;
  email: string;
  rfc?: string;
  phone?: string;
  industry?: string;
  size: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
  companyType: string;
  websiteUrl?: string;
  address?: string;
  description?: string;
  logoUrl?: string;
  fiscalDocumentUrl?: string;
  contactName?: string;
  contactPosition?: string;
  contactEmail?: string;
  isApprove: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  stateId?: number;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Job Vacancy (Vacante)

```typescript
interface Vacante {
  id: string;
  title: string;
  summary: string;
  description: string;
  responsibilities: string;
  requirements?: string;
  benefits?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  career?: string;
  department?: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  modality: "remote" | "on-site" | "hybrid";
  numberOfPositions: number;
  deadline?: Date;
  status: "active" | "expired" | "closed";
  applicationProcess?: string;
  isMock: boolean;
  companyId: string;
  stateId?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Application

```typescript
interface Application {
  id: string;
  userId: string;
  vacanteId: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedAt: Date;
  reviewedAt?: Date;
  notes?: string;
}
```

## Interactive Documentation

For interactive API documentation with the ability to test endpoints, visit:

```
http://localhost:3000/api-docs
```

This provides a Swagger UI interface where you can:

- Browse all available endpoints
- View detailed request/response schemas
- Test API endpoints directly from the browser
- See example requests and responses

## File Upload Guidelines

### CV Upload

- **Format**: PDF only
- **Size**: Maximum 5MB
- **Naming**: `cv_{userId}_{timestamp}.pdf`
- **Access**: User owns file, companies can access if user applied to their jobs, coordinators have full access

### Company Logo Upload

- **Formats**: JPG, PNG, WEBP
- **Size**: Maximum 5MB
- **Access**: Public access for approved companies

### Fiscal Document Upload

- **Formats**: PDF, JPG, PNG, WEBP
- **Size**: Maximum 10MB
- **Access**: Company owner and coordinators only

## Rate Limiting

Currently, no rate limiting is implemented, but it's recommended to implement rate limiting for production use.

## Error Handling

The API implements consistent error handling:

1. **Validation Errors**: Return 400 with specific field errors
2. **Authentication Errors**: Return 401 with clear message
3. **Authorization Errors**: Return 403 with permission details
4. **Not Found Errors**: Return 404 with resource information
5. **Server Errors**: Return 500 with generic message (detailed errors logged server-side)

## Security Considerations

1. **Authentication**: All sensitive endpoints require authentication
2. **Authorization**: Role-based access control implemented
3. **File Access**: Proper authorization checks for file downloads
4. **Input Validation**: Server-side validation for all inputs
5. **SQL Injection**: Protected by Prisma ORM
6. **XSS Protection**: Input sanitization implemented

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .example.env .env
   ```

3. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

4. Start development server:

   ```bash
   npm run dev
   ```

5. Access API documentation:
   ```
   http://localhost:3000/api-docs
   ```

## Support

For API support or questions, contact the development team or refer to the interactive documentation at `/api-docs`.
