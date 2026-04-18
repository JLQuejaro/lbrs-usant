# Email Domain Restriction Policy

## Overview

The USANT LBRS system enforces strict email domain validation to ensure only authorized university members can access the platform.

## Policy

**Only email addresses ending in `@usant.edu.ph` are permitted to register and login.**

## Implementation

### Server-Side Validation

- **Login Route** (`/api/auth/login`): Validates email domain before authentication
- **Registration Route** (`/api/auth/register`): Validates email domain before account creation
- **Validation Logic** (`src/app/lib/email-validation.ts`): Centralized domain checking

### Security Features

1. **Tamper-Proof**: Validation occurs server-side and cannot be bypassed via frontend manipulation
2. **Security Logging**: All unauthorized attempts are logged with:
   - Email address used
   - Context (login/registration)
   - Timestamp
3. **Clear Error Messages**: Users receive immediate feedback when using invalid domains

### User Interface

- **Domain Notice**: Login/registration page displays restriction prominently
- **Real-Time Validation**: Email input provides instant feedback for invalid domains
- **Visual Indicators**: Invalid emails are highlighted with red borders

## Testing

### Valid Test Cases
- `student@usant.edu.ph` ✓
- `faculty@usant.edu.ph` ✓
- `admin@usant.edu.ph` ✓

### Invalid Test Cases
- `user@gmail.com` ✗
- `user@usant.edu` ✗
- `user@usant.edu.ph.fake.com` ✗
- `user@student.usant.edu.ph` ✗ (subdomain)

## Error Messages

- **403 Forbidden**: "Only @usant.edu.ph email addresses are allowed"

## Security Monitoring

Unauthorized attempts are logged to console with format:
```
[SECURITY] Unauthorized login attempt - Email: {email}, Context: {context}, Timestamp: {ISO timestamp}
```

## Admin Management

Currently, the domain restriction is hardcoded to `@usant.edu.ph`. To modify:

1. Edit `src/app/lib/email-validation.ts`
2. Update the `ALLOWED_DOMAIN` constant
3. Redeploy the application

### Future Enhancements

- Database-driven whitelist for multiple domains
- Admin panel for domain management
- Temporary access tokens for guest users
- Integration with university SSO/LDAP

## Compliance

This restriction ensures:
- Only verified university members access the system
- Compliance with university data policies
- Reduced risk of unauthorized access
- Audit trail for security monitoring
