# CV Upload Feature Documentation

## Overview

Added CV upload functionality to the user profile page, allowing students to upload their curriculum vitae in PDF format.

## Features Implemented

### 1. File Upload API Endpoint

- **Location**: `app/api/usuarios/me/cv/route.ts`
- **Methods**: POST (upload), DELETE (remove)
- **File Restrictions**:
  - Only PDF files allowed
  - Maximum file size: 5MB
  - One CV per user (replaces existing)

### 2. File Storage

- **Location**: `public/uploads/cvs/`
- **Naming**: `cv_{userId}_{timestamp}.pdf`
- **Security**: Files excluded from git via `.gitignore`

### 3. Database Integration

- Uses existing `cvUrl` field in User model
- Stores relative path to uploaded file
- Automatically removes old files when new CV is uploaded

### 4. User Interface

- **Location**: Documents tab in `app/client/perfil/page.tsx`
- **Features**:
  - Drag & drop file upload
  - File validation with error messages
  - Progress indicators during upload/delete
  - Download/view current CV
  - Replace existing CV functionality

### 5. Type Safety

- Updated `types/users.ts` with CV-related interfaces
- Proper error handling and response types

## Usage Instructions

### For Users:

1. Navigate to Profile → Documents tab
2. Click "Subir CV" or drag PDF file to upload area
3. File is validated and uploaded automatically
4. Use "Ver CV" to download/view current CV
5. Use "Eliminar" to remove CV
6. Use "Reemplazar CV" to upload a new version

### For Developers:

1. CV files are stored locally in `public/uploads/cvs/`
2. Database stores relative URL path in `user.cvUrl`
3. API handles file validation, storage, and cleanup
4. Frontend provides real-time feedback and error handling

## Security Considerations

- File type validation (PDF only)
- File size limits (5MB max)
- User authentication required
- Files stored outside of git repository
- Automatic cleanup of replaced files

## File Structure

```
public/
  uploads/
    cvs/
      .gitkeep          # Keeps directory in git
      cv_user1_123.pdf  # User CV files (ignored by git)

app/
  api/
    usuarios/
      me/
        cv/
          route.ts      # CV upload/delete API

app/
  client/
    perfil/
      page.tsx          # Profile page with CV upload UI
```

## Environment Requirements

- Next.js file system access
- Prisma database with User.cvUrl field
- NextAuth session management
