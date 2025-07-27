# Password Recovery System Documentation

## Overview

The password recovery system provides a secure, email-based password reset mechanism for company accounts in the UPQROO job board platform. This feature allows companies to regain access to their accounts through a secure token-based verification process.

## Features

- **Secure Token Generation**: Cryptographically secure random tokens with 1-hour expiration
- **Email-Based Recovery**: Professional email templates with UPQROO branding
- **Security-First Design**: Prevents email enumeration and implements proper token validation
- **User-Friendly Interface**: Modal-based recovery initiation and dedicated reset page
- **Comprehensive Error Handling**: Clear messaging for all error scenarios
- **Single-Use Tokens**: Tokens are invalidated after successful password reset

## Architecture

### Components

#### Frontend Components

1. **ForgotPasswordModal** (`components/ForgotPasswordModal.tsx`)

   - Modal dialog for password recovery initiation
   - Email validation with real-time feedback
   - Success state with clear instructions
   - Loading states and error handling

2. **ResetPasswordPage** (`app/auth/reset-password/page.tsx`)
   - Dedicated page for setting new password
   - Token validation on page load
   - Password strength validation (minimum 8 characters)
   - Password confirmation matching
   - Success state with automatic redirect

#### API Endpoints

1. **Forgot Password API** (`app/api/auth/forgot-password/route.ts`)

   - **Method**: POST
   - **Purpose**: Initiate password recovery process
   - **Security**: Always returns success to prevent email enumeration
   - **Functionality**: Validates email, generates token, sends recovery email

2. **Reset Password API** (`app/api/auth/reset-password/route.ts`)
   - **GET Method**: Validates reset tokens
   - **POST Method**: Updates password and invalidates token
   - **Security**: Proper token validation and expiration handling

#### Utilities

1. **Password Reset Utilities** (`lib/password-reset.ts`)
   - Token generation using `crypto.randomBytes(32)`
   - Token validation with expiration and usage checks
   - Token cleanup utilities for maintenance
   - Database operations for token management

### Database Schema

```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  email     String
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@map("password_reset_tokens")
}
```

## User Flow

### 1. Password Recovery Initiation

1. User clicks "¿Olvidaste tu contraseña?" on login page
2. ForgotPasswordModal opens with email input form
3. User enters email address with real-time validation
4. System validates email format and checks company database
5. If email exists, generates secure token and sends recovery email
6. Always shows success message for security (prevents email enumeration)

### 2. Email Recovery Process

1. User receives professional email with UPQROO branding
2. Email contains secure reset link with 1-hour expiration
3. Email includes security warnings and clear instructions
4. User clicks reset link to access password reset page

### 3. Password Reset Completion

1. System validates token on page load
2. If token is valid, shows password reset form
3. User enters new password with strength validation
4. User confirms password with matching validation
5. System updates password and invalidates token
6. Success confirmation with automatic redirect to login

## Security Features

### Token Security

- **Cryptographically Secure**: Uses `crypto.randomBytes(32)` for token generation
- **Time-Limited**: 1-hour expiration window
- **Single-Use**: Tokens are invalidated after successful use
- **Unique**: Each token is unique and stored securely
- **Automatic Cleanup**: Expired tokens are marked for cleanup

### Email Security

- **No Email Enumeration**: Always returns success regardless of email existence
- **Professional Templates**: Branded emails with security warnings
- **Secure Links**: HTTPS-only reset links
- **Clear Expiration**: Users informed of 1-hour expiration

### Input Validation

- **Server-Side Validation**: All inputs validated on server
- **Password Strength**: Minimum 8 characters required
- **Email Format**: Proper email format validation
- **SQL Injection Prevention**: Prisma ORM provides protection
- **XSS Protection**: Proper input sanitization

## Email Templates

The system uses a professional HTML email template with:

- **UPQROO Branding**: Consistent visual identity
- **Clear Call-to-Action**: Prominent reset button
- **Security Information**: Warnings about link sharing
- **Expiration Notice**: Clear 1-hour expiration time
- **Support Information**: Contact details for assistance

### Template Variables

- `{{userName}}`: Company name
- `{{resetUrl}}`: Secure reset link with token
- `{{appUrl}}`: Application base URL

## Error Handling

### Frontend Error States

- **Network Errors**: Retry options with clear messaging
- **Validation Errors**: Real-time field validation
- **Token Errors**: Specific messaging for expired/invalid tokens
- **Server Errors**: Generic error messages with support contact

### API Error Responses

- **400 Bad Request**: Invalid input data
- **404 Not Found**: Token not found (treated as invalid)
- **409 Conflict**: Token already used
- **410 Gone**: Token expired
- **500 Internal Server Error**: Server-side errors

### Error Messages (Spanish)

```typescript
const ERROR_MESSAGES = {
  INVALID_EMAIL: "Por favor ingresa un correo electrónico válido",
  TOKEN_EXPIRED: "El enlace de recuperación ha expirado. Solicita uno nuevo.",
  TOKEN_INVALID: "El enlace de recuperación no es válido.",
  TOKEN_USED: "Este enlace ya ha sido utilizado.",
  PASSWORD_WEAK: "La contraseña debe tener al menos 8 caracteres",
  PASSWORDS_MISMATCH: "Las contraseñas no coinciden",
  NETWORK_ERROR: "Error de conexión. Inténtalo de nuevo.",
  SERVER_ERROR: "Error del servidor. Contacta al soporte si persiste.",
};
```

## Integration Points

### Login Page Integration

The ForgotPasswordModal is integrated into the company login tab:

```typescript
// Login page includes the modal
<ForgotPasswordModal
  isOpen={showForgotPassword}
  onClose={() => setShowForgotPassword(false)}
/>
```

### Email Service Integration

Uses the existing email service (`lib/emailService.ts`) with the `passwordReset` template:

```typescript
await sendEmailDirect({
  to: email,
  template: "passwordReset",
  templateData: {
    userName: company.name,
    resetUrl: resetUrl,
  },
});
```

## Environment Variables

Required environment variables for the password recovery system:

```env
# Email Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
SMTP_FROM_NAME="UPQROO Bolsa de Trabajo"

# Application URL
NEXTAUTH_URL=https://your-domain.com
```

## Database Operations

### Token Management

1. **Token Creation**: Generates new token and invalidates existing ones
2. **Token Validation**: Checks existence, expiration, and usage status
3. **Token Usage**: Marks token as used after successful password reset
4. **Token Cleanup**: Removes expired and used tokens (maintenance)

### Password Update

1. **Hash Generation**: Uses bcrypt with salt rounds of 12
2. **Database Update**: Updates company password in secure transaction
3. **Token Invalidation**: Marks reset token as used immediately

## Performance Considerations

### Database Optimization

- **Indexed Fields**: Token field has unique index for fast lookups
- **Efficient Queries**: Optimized queries for email and token validation
- **Cleanup Strategy**: Regular cleanup of expired tokens

### Frontend Performance

- **Lazy Loading**: Reset password page is loaded on demand
- **Form Optimization**: Efficient validation and state management
- **Bundle Size**: Minimal dependencies for auth components

## Monitoring and Maintenance

### Logging

- **Password Reset Attempts**: Logged without sensitive data
- **Token Generation**: Tracked for security monitoring
- **Email Delivery**: Success/failure rates monitored
- **Error Tracking**: Comprehensive error logging for debugging

### Maintenance Tasks

- **Token Cleanup**: Regular cleanup of expired tokens
- **Email Monitoring**: Track delivery rates and bounces
- **Security Audits**: Regular review of token generation and validation

## Testing Strategy

### Unit Tests

- Token generation and validation logic
- Password hashing and comparison
- Email format validation
- Error handling functions

### Integration Tests

- Complete password recovery flow
- Email sending functionality
- Database operations
- API endpoint responses

### Security Tests

- Token uniqueness and randomness
- Token expiration enforcement
- SQL injection prevention
- XSS prevention in forms

## Future Enhancements

### Potential Improvements

1. **Rate Limiting**: Implement request limits per email/IP
2. **CAPTCHA Integration**: Add CAPTCHA for repeated requests
3. **Audit Logging**: Enhanced logging for security audits
4. **Mobile Optimization**: Improved mobile experience
5. **Multi-Language Support**: Additional language options

### Security Enhancements

1. **Two-Factor Authentication**: Optional 2FA for password resets
2. **IP Validation**: Track and validate request origins
3. **Suspicious Activity Detection**: Monitor for abuse patterns
4. **Enhanced Token Security**: Consider JWT tokens for additional security

## Troubleshooting

### Common Issues

1. **Email Not Received**

   - Check spam/junk folders
   - Verify SMTP configuration
   - Check email service logs

2. **Token Expired**

   - Request new password reset
   - Check system time synchronization
   - Verify token expiration logic

3. **Password Reset Fails**
   - Verify token validity
   - Check database connectivity
   - Review error logs

### Support Information

For technical support or issues with the password recovery system:

- **Email**: soporte@upqroo.edu.mx
- **Documentation**: This file and related specs
- **Logs**: Check application logs for detailed error information
