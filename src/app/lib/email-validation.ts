/**
 * Email Domain Validation
 * Enforces @usant.edu.ph domain restriction
 */

const ALLOWED_DOMAIN = '@usant.edu.ph';

export function isValidUniversityEmail(email: string): boolean {
  return email.toLowerCase().endsWith(ALLOWED_DOMAIN);
}

export function getEmailDomainError(): string {
  return `Only ${ALLOWED_DOMAIN} email addresses are allowed`;
}

export function logUnauthorizedAttempt(email: string, context: string): void {
  console.warn(`[SECURITY] Unauthorized login attempt - Email: ${email}, Context: ${context}, Timestamp: ${new Date().toISOString()}`);
}
