# Document Security & Access Control

## Overview

The UPQROO job board platform implements comprehensive authentication and authorization for all document uploads to ensure sensitive information is only accessible to authorized users.

## Document Types & Access Rules

### 📄 **CV Documents** (`/api/uploads/cvs/[filename]`)

- **Format**: `cv_{userId}_{timestamp}.pdf`
- **Storage**: `/uploads/cvs/`
- **Access Control**:
  - ✅ **Own User**: Can access their own CV
  - ✅ **Companies**: Can access CVs of users who have applied to their job postings
  - ✅ **Coordinators**: Can access any CV
  - ❌ **Other Users**: No access

### 🏢 **Fiscal Documents** (`/api/uploads/fiscal-documents/[filename]`)

- **Format**: `fiscal_{companyId}_{timestamp}.{ext}`
- **Storage**: `/uploads/fiscal-documents/`
- **Access Control**:
  - ✅ **Own Company**: Can access their own fiscal documents
  - ✅ **Coordinators**: Can access any company's fiscal documents
  - ❌ **Other Users/Companies**: No access

### 📸 **Profile Photos** (`/api/uploads/photos/[filename]`)

- **Format**: `photo_{userId}_{timestamp}.{ext}`
- **Storage**: `/uploads/photos/`
- **Access Control**:
  - ✅ **Own User**: Can access their own photos
  - ✅ **Coordinators**: Can access any user's photos
  - ❌ **Other Users**: No access

## Security Features

### 🔐 **Authentication**

- All document endpoints require valid NextAuth session
- Unauthenticated requests return `401 Unauthorized`

### 🛡️ **Authorization**

- Role-based access control (RBAC)
- Database verification of file ownership
- Application-based access for company-CV relationships

### 🔒 **File Security**

- Directory traversal protection (`..`, `/`, `\` blocked)
- Filename format validation
- File existence verification in database
- Secure file path resolution

### 📋 **HTTP Security Headers**

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Cache-Control: private` (prevents caching in shared caches)

## Implementation Details

### Database Relationships

```prisma
// CV access through applications
Application {
  userId    -> User.id (CV owner)
  vacanteId -> Vacante.id -> Company.id (accessing company)
}

// File ownership verification
User.cvUrl -> filename verification
Company.fiscalDocumentUrl -> filename verification
User.image -> filename verification
```

### Error Handling

- `400 Bad Request`: Invalid filename format
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: File doesn't exist or not authorized
- `500 Internal Server Error`: Server-side errors

## Usage Examples

### Accessing a CV

```typescript
// User accessing their own CV
GET / api / uploads / cvs / cv_user123_1640995200000.pdf;
// ✅ Allowed if session.user.id === 'user123'

// Company accessing applicant's CV
GET / api / uploads / cvs / cv_user123_1640995200000.pdf;
// ✅ Allowed if company has received application from user123

// Coordinator accessing any CV
GET / api / uploads / cvs / cv_user123_1640995200000.pdf;
// ✅ Allowed if session.user.role === 'coordinator'
```

### Accessing Fiscal Documents

```typescript
// Company accessing their own document
GET / api / uploads / fiscal - documents / fiscal_company456_1640995200000.pdf;
// ✅ Allowed if session.user.id === 'company456' && role === 'company'

// Coordinator accessing company document
GET / api / uploads / fiscal - documents / fiscal_company456_1640995200000.pdf;
// ✅ Allowed if session.user.role === 'coordinator'
```

## Security Best Practices

### ✅ **Implemented**

- Authentication required for all document access
- Role-based authorization
- File ownership verification
- Directory traversal protection
- Secure HTTP headers
- Private caching only

### 🔄 **Recommended Enhancements**

- File virus scanning before storage
- Rate limiting for document access
- Audit logging for sensitive document access
- File encryption at rest
- Content Security Policy (CSP) headers

## Monitoring & Logging

All document access attempts are logged with:

- User ID and role
- Requested file
- Access result (allowed/denied)
- Timestamp
- IP address (via request headers)

## Compliance Notes

This implementation follows security best practices for:

- Data privacy (GDPR-like principles)
- Access control (principle of least privilege)
- Audit trails for sensitive data access
- Secure file handling
