/**
 * Instrumentation - Startup Validation
 * Runs before the application starts to validate critical environment variables
 */

export async function register() {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is required. Application cannot start without it.');
  }
}
