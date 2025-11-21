# External Vacantes Feature

## Overview

Coordinators can now create job postings (vacantes) for external companies that are not registered on the platform. These vacantes can be either:

1. **Image-only vacantes**: Simple job postings that only contain an image (e.g., a flyer or poster)
2. **Detailed vacantes**: Full job postings with all standard fields, but for external companies

## Database Schema Changes

### Vacante Model Updates

New fields added to the `Vacante` model:

- `isExternal` (Boolean): Indicates if the vacante is for an external (non-registered) company
- `isImageOnly` (Boolean): Indicates if the vacante is image-only (no detailed fields required)
- `externalCompanyName` (String, optional): Name of the external company
- `externalCompanyEmail` (String, optional): Contact email for the external company
- `externalCompanyPhone` (String, optional): Contact phone for the external company
- `createdByCoordinatorId` (String, optional): ID of the coordinator who created this vacante
- `companyId` (String, optional): Now optional to support external vacantes

### Relations

- `createdByCoordinator`: Relation to the User model (coordinator who created the vacante)
- `company`: Now optional relation (null for external vacantes)

## API Endpoints

### Create External Vacante

**POST** `/api/coordinador/vacantes/external`

Creates a new external vacante. Only accessible by coordinators.

#### Request Body

For **image-only** vacantes:

```json
{
  "title": "Desarrollador Full Stack",
  "externalCompanyName": "Tech Solutions SA",
  "externalCompanyEmail": "rh@techsolutions.com",
  "externalCompanyPhone": "+52 998 123 4567",
  "imageUrl": "/uploads/job-images/job-poster.jpg",
  "isImageOnly": true,
  "location": "Cancún, Q. Roo",
  "career": "Ingeniería en Software",
  "type": "Full-time",
  "modality": "Hybrid",
  "deadline": "2025-12-31T23:59:59Z",
  "stateId": 1
}
```

For **detailed** vacantes:

```json
{
  "title": "Desarrollador Full Stack",
  "summary": "Buscamos desarrollador con experiencia en React y Node.js",
  "description": "Descripción completa del puesto...",
  "responsibilities": "- Desarrollar aplicaciones web\n- Mantener código existente",
  "externalCompanyName": "Tech Solutions SA",
  "externalCompanyEmail": "rh@techsolutions.com",
  "externalCompanyPhone": "+52 998 123 4567",
  "imageUrl": "/uploads/job-images/job-poster.jpg",
  "isImageOnly": false,
  "location": "Cancún, Q. Roo",
  "career": "Ingeniería en Software",
  "type": "Full-time",
  "modality": "Hybrid",
  "deadline": "2025-12-31T23:59:59Z",
  "stateId": 1
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "title": "Desarrollador Full Stack",
    "isExternal": true,
    "isImageOnly": true,
    "externalCompanyName": "Tech Solutions SA",
    "createdByCoordinator": {
      "name": "Juan Pérez",
      "email": "juan.perez@upqroo.edu.mx"
    },
    ...
  },
  "message": "Vacante externa creada correctamente"
}
```

### List External Vacantes

**GET** `/api/coordinador/vacantes/external?offset=0&limit=10`

Lists all external vacantes with pagination.

#### Response

```json
{
  "total": 25,
  "data": [
    {
      "id": "clx...",
      "title": "Desarrollador Full Stack",
      "isExternal": true,
      "isImageOnly": true,
      "externalCompanyName": "Tech Solutions SA",
      "createdByCoordinator": {
        "name": "Juan Pérez",
        "email": "juan.perez@upqroo.edu.mx"
      },
      ...
    }
  ]
}
```

## Usage Examples

### Creating an Image-Only Vacante

1. Coordinator uploads a job poster image to `/uploads/job-images/`
2. Coordinator creates the vacante with minimal information:
   - Title
   - External company name
   - Image URL
   - Optional: contact info, location, career, etc.

### Creating a Detailed External Vacante

1. Coordinator fills in all job details as they would for a regular vacante
2. Optionally includes an image
3. Provides external company contact information

## Migration

Run the following command to apply the database changes:

```bash
npx prisma migrate dev
```

Or if already applied:

```bash
npx prisma generate
```

## Notes

- External vacantes do not have a `companyId` (it's null)
- Students can still apply to external vacantes through the normal application process
- The coordinator who created the vacante is tracked via `createdByCoordinatorId`
- Image-only vacantes have placeholder text for required fields (summary, description, responsibilities)
