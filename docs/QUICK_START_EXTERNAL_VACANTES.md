# Quick Start: External Vacantes

## What Changed?

Coordinators can now create job postings for companies that aren't registered on the platform. These can be:

- **Image-only**: Just upload a job poster/flyer
- **Detailed**: Full job description with external company info

## Database Changes Applied ✅

- Migration `20251115031907_add_coordinator_external_vacantes` has been applied
- Prisma client has been regenerated
- Schema is valid and ready to use

## New API Endpoint

### Create External Vacante

```
POST /api/coordinador/vacantes/external
```

**Minimum required for image-only:**

```json
{
  "title": "Job Title",
  "externalCompanyName": "Company Name",
  "imageUrl": "/uploads/job-images/poster.jpg",
  "isImageOnly": true
}
```

**For detailed vacante:**

```json
{
  "title": "Job Title",
  "summary": "Brief summary",
  "description": "Full description",
  "responsibilities": "Job responsibilities",
  "externalCompanyName": "Company Name",
  "externalCompanyEmail": "contact@company.com",
  "isImageOnly": false
}
```

### List External Vacantes

```
GET /api/coordinador/vacantes/external?offset=0&limit=10
```

## Key Schema Fields

### Vacante Model - New Fields:

- `isExternal` - Boolean (identifies external vacantes)
- `isImageOnly` - Boolean (image-only vs detailed)
- `externalCompanyName` - String (company name)
- `externalCompanyEmail` - String (contact email)
- `externalCompanyPhone` - String (contact phone)
- `createdByCoordinatorId` - String (who created it)
- `companyId` - Now optional (null for external)

## How It Works

1. **Coordinator** creates a vacante via the API
2. System validates:
   - User is a coordinator
   - Required fields are present
   - Image URL exists (for image-only)
3. Vacante is created with `isExternal = true`
4. Students can see and apply to these vacantes
5. External company info is displayed instead of registered company

## Integration Points

### Existing Endpoints Updated:

- `GET /api/vacantes` - Now includes `createdByCoordinator` info

### Frontend Changes Needed:

1. Add form in coordinator dashboard to create external vacantes
2. Update vacante display to show external company info
3. Add image upload for job posters
4. Handle image-only display in vacante details

## Testing

```bash
# Verify schema is valid
npx prisma validate

# Regenerate client if needed
npx prisma generate

# Check database is in sync
npx prisma migrate status
```

## Files Modified

- ✅ `prisma/models/vacante.prisma` - Schema updates
- ✅ `prisma/schema.prisma` - User relation added
- ✅ `app/api/coordinador/vacantes/external/route.ts` - New endpoint
- ✅ `app/api/vacantes/route.ts` - Enhanced GET response

## Files Created

- 📄 `docs/external-vacantes.md` - Full documentation
- 📄 `docs/external-vacantes-usage-example.tsx` - React examples
- 📄 `CHANGES_SUMMARY.md` - Implementation summary
- 📄 `docs/QUICK_START_EXTERNAL_VACANTES.md` - This file

## Next Steps

1. Create UI form for coordinators
2. Add image upload functionality
3. Update vacante listing to display external info
4. Test with real data
5. Add validation/approval workflow if needed
