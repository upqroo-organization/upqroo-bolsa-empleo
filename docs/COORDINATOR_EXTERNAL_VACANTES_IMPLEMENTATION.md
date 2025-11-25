# Coordinator External Vacantes - Implementation Summary

## Overview

Coordinators can now create job postings for external (non-registered) companies directly from the platform. This feature supports both image-only vacantes (flyers/posters) and detailed vacantes with full information.

## What Was Implemented

### 1. Database Schema (Already Done)

- Modified `Vacante` model to support external companies
- Added fields: `isExternal`, `isImageOnly`, `externalCompanyName`, `externalCompanyEmail`, `externalCompanyPhone`, `createdByCoordinatorId`
- Made `companyId` optional
- Migration applied successfully

### 2. API Endpoints

#### Created: `/api/coordinador/vacantes/external`

- **POST**: Create external vacante
- **GET**: List all external vacantes
- Only accessible by coordinators
- Validates required fields based on vacante type (image-only vs detailed)

#### Created: `/api/uploads/job-images`

- **POST**: Upload job images
- Supports JPG, PNG, WebP, SVG
- Max file size: 5MB
- Generates unique filenames

#### Updated: `/api/vacantes`

- Enhanced GET endpoint to include `createdByCoordinator` information
- Now properly displays external vacantes alongside regular ones

### 3. Frontend Pages

#### Created: `/app/coordinador/vacantes-publicadas/crear-externa/page.tsx`

Complete form for creating external vacantes with:

- **External Company Information Section**:

  - Company name (required)
  - Contact email (optional)
  - Contact phone (optional)

- **Vacante Type Toggle**:

  - Checkbox to switch between detailed and image-only vacantes
  - Changes required fields dynamically

- **Basic Information Tab**:

  - Job title
  - Career
  - Employment type
  - Work modality (Remote/On-site/Hybrid)
  - Location and state
  - Number of positions
  - Summary (required for detailed vacantes)

- **Details Tab**:
  - Image upload (required for image-only, optional for detailed)
  - Full description (for detailed vacantes)
  - Responsibilities (for detailed vacantes)
  - Salary range (optional)
  - Deadline date

#### Updated: `/app/coordinador/vacantes-publicadas/page.tsx`

- Added "Crear Vacante Externa" button in the header
- Button redirects to the new external vacante creation page

#### Updated: `/app/coordinador/page.tsx`

- Added "Crear Vacante Externa" button in the dashboard header
- Provides quick access to create external vacantes from the main dashboard
- Button positioned next to "Enviar Correo Masivo" for easy access

## How It Works

### Creating an Image-Only Vacante

1. Coordinator clicks "Crear Vacante Externa"
2. Fills in external company name
3. Checks "Vacante de solo imagen" checkbox
4. Fills basic job info (title, type, modality, location)
5. Uploads job poster/flyer image
6. Sets optional deadline
7. Clicks "Publicar Vacante Externa"

### Creating a Detailed External Vacante

1. Coordinator clicks "Crear Vacante Externa"
2. Fills in external company information
3. Leaves "Vacante de solo imagen" unchecked
4. Fills all job details (title, summary, description, responsibilities)
5. Optionally uploads an image
6. Sets salary range and deadline
7. Clicks "Publicar Vacante Externa"

## Key Features

### Validation

- Required fields change based on vacante type
- Image required for image-only vacantes
- Full description required for detailed vacantes
- Real-time error display
- Tab indicators show which sections have errors

### User Experience

- Reuses existing company vacante form components
- Familiar interface for coordinators
- Clear visual indicators (red dots for errors, green for image selected)
- Responsive design for mobile and desktop
- Toast notifications for success/error feedback

### Data Flow

1. Form data collected
2. Image uploaded first (if provided)
3. External vacante created via API with image URL
4. Coordinator tracked via `createdByCoordinatorId`
5. Redirect to vacantes list on success

## File Structure

```
app/
├── coordinador/
│   └── vacantes-publicadas/
│       ├── crear-externa/
│       │   └── page.tsx          # New: External vacante creation form
│       └── page.tsx               # Updated: Added create button
└── api/
    ├── coordinador/
    │   └── vacantes/
    │       └── external/
    │           └── route.ts       # Already created: External vacantes API
    └── uploads/
        └── job-images/
            ├── route.ts           # New: Image upload endpoint
            └── [...path]/
                └── route.ts       # Existing: Image serving endpoint
```

## Integration Points

### Existing Components Reused

- All UI components from `@/components/ui/*`
- `TempImageUpload` component for image handling
- `useFetch` hook for states data
- Career and vacante type enums from `@/types/vacantes`
- Toast notifications from Sonner

### Authentication

- Uses NextAuth session
- Validates coordinator role
- Tracks creator in database

### File Uploads

- Images stored in `/uploads/job-images/`
- Unique filenames with timestamp
- Proper MIME type validation
- Size limits enforced

## Display in Platform

External vacantes will appear in:

- Coordinator's vacantes list (with external company name)
- Student job search (showing external company info instead of registered company)
- Applications can be submitted normally
- Contact information displayed for external companies

## Next Steps (Optional Enhancements)

1. **Edit External Vacantes**: Create edit page similar to company edit
2. **Visual Indicators**: Add badges to distinguish external vacantes in lists
3. **Bulk Upload**: Allow coordinators to upload multiple vacantes via CSV
4. **Templates**: Save common external company info as templates
5. **Analytics**: Track performance of external vs registered company vacantes
6. **Approval Workflow**: Add optional approval step for external vacantes

## Testing Checklist

- [ ] Create image-only external vacante
- [ ] Create detailed external vacante
- [ ] Upload different image formats (JPG, PNG, WebP)
- [ ] Test file size validation (>5MB should fail)
- [ ] Verify required field validation
- [ ] Check deadline functionality
- [ ] Confirm vacante appears in list
- [ ] Test on mobile devices
- [ ] Verify coordinator tracking
- [ ] Check external company info display

## Notes

- External vacantes have `companyId = null`
- Image-only vacantes use placeholder text for required description fields
- All external vacantes are tracked by creator (coordinator)
- Students can apply to external vacantes normally
- Contact information for external companies is optional but recommended
