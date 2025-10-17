# Email Campaign Feature for Coordinators

## Overview

This feature allows coordinators to send mass emails to all registered companies using predefined templates or custom messages. The system includes template management, recipient selection, email preview, and delivery tracking.

## Features

### 1. Mass Email Campaign

- **Location**: Coordinator Dashboard → "Enviar Correo Masivo" button
- **Functionality**: Send emails to multiple companies simultaneously
- **Recipients**: All approved companies in the system

### 2. Email Templates

- **Location**: Navigation → "Plantillas de Correo"
- **Available Templates**:
  - **Job Fair**: Invitations for employment fairs
  - **Survey Request**: Request performance evaluations for hired students
  - **Partnership**: Collaboration proposals
  - **Newsletter**: Monthly updates and news
  - **Reminder**: General reminders and notifications

### 3. Campaign Composer

- **Template Selection**: Choose from predefined templates or create custom messages
- **Variable Replacement**: Dynamic content based on company information
- **Recipient Management**: Select specific companies or all approved companies
- **Preview System**: See how emails will look before sending

### 4. Delivery Tracking

- **Success/Failure Counts**: Track how many emails were sent successfully
- **Error Reporting**: Detailed error messages for failed deliveries
- **Results Summary**: Complete campaign statistics

## API Endpoints

### Email Campaigns

- `GET /api/coordinador/email-campaigns` - Get all approved companies
- `POST /api/coordinador/email-campaigns` - Send mass email campaign

### Email Templates

- `GET /api/coordinador/email-templates` - Get all available templates

## Usage Instructions

### Sending a Mass Email Campaign

1. **Access the Feature**

   - Go to Coordinator Dashboard
   - Click "Enviar Correo Masivo" button

2. **Compose Email**

   - Select a template or write custom message
   - Fill in template variables if using a template
   - Write subject and message content

3. **Select Recipients**

   - Choose which companies to send to
   - Use filters to narrow down recipients
   - Review selected companies

4. **Preview and Send**
   - Generate preview to see final email
   - Review content and recipients
   - Send campaign and track results

### Managing Email Templates

1. **View Templates**

   - Navigate to "Plantillas de Correo"
   - Browse available templates
   - Preview template content

2. **Template Variables**
   - Each template has specific variables
   - Variables are automatically replaced with company data
   - Common variables: `{{companyName}}`, `{{contactName}}`

## Template Variables

### Common Variables (Available in all templates)

- `{{companyName}}` - Company name
- `{{contactName}}` - Contact person name

### Template-Specific Variables

#### Job Fair Template

- `{{eventDate}}` - Event date
- `{{eventLocation}}` - Event location
- `{{registrationDeadline}}` - Registration deadline
- `{{contactEmail}}` - Contact email

#### Survey Request Template

- `{{studentName}}` - Student name
- `{{position}}` - Job position
- `{{hireDate}}` - Hire date
- `{{surveyLink}}` - Survey link

#### Partnership Template

- `{{partnershipType}}` - Type of partnership
- `{{benefits}}` - Partnership benefits
- `{{nextSteps}}` - Next steps

#### Newsletter Template

- `{{month}}` - Newsletter month
- `{{highlights}}` - Monthly highlights
- `{{statistics}}` - Platform statistics
- `{{upcomingEvents}}` - Upcoming events

#### Reminder Template

- `{{reminderType}}` - Type of reminder
- `{{details}}` - Reminder details
- `{{deadline}}` - Deadline
- `{{action}}` - Required action

## Technical Implementation

### Components

- `EmailCampaignModal.tsx` - Main campaign interface
- `app/coordinador/plantillas-email/page.tsx` - Template management page

### API Routes

- `app/api/coordinador/email-campaigns/route.ts` - Campaign management
- `app/api/coordinador/email-templates/route.ts` - Template definitions

### Email Service

- Uses existing `emailService.ts` for email delivery
- Supports HTML and text formats
- Includes error handling and retry logic

## Security and Permissions

- Only coordinators can access email campaign features
- All recipients must be approved companies
- Email content is sanitized and validated
- Delivery tracking includes error logging

## Future Enhancements

1. **Custom Template Creation**: Allow coordinators to create new templates
2. **Scheduling**: Schedule campaigns for future delivery
3. **Analytics**: Track email open rates and click-through rates
4. **Segmentation**: Advanced recipient filtering and segmentation
5. **A/B Testing**: Test different email versions
6. **Automation**: Trigger campaigns based on events (new company approval, etc.)
