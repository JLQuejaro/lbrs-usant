/**
 * Password Validation Utility
 * Comprehensive password strength checker with security best practices
 */

// Common passwords list (top 100 most common)
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567', 
  'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
  'ashley', 'bailey', 'passw0rd', 'shadow', '123123', '654321', 'superman',
  'qazwsx', 'michael', 'football', 'welcome', 'jesus', 'ninja', 'mustang',
  'password1', '123456789', 'password123', 'admin', 'root', 'user', 'test'
];

// Common sequences
const SEQUENCES = [
  'abcdefgh', '12345678', 'qwertyui', 'asdfghjk', 'zxcvbnm',
  '87654321', 'hgfedcba', 'zyxwvuts'
];

export interface PasswordValidation {
  isValid: boolean;
  strength: 'weak' | 'moderate' | 'strong' | 'very-strong';
  score: number; // 0-100
  errors: string[];
  suggestions: string[];
}

/**
 * Validate password against all security requirements
 */
export function validatePassword(
  password: string,
  fullName?: string,
  email?: string
): PasswordValidation {
  const errors: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // Check minimum length (8 characters)
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
    suggestions.push(`Add ${8 - password.length} more characters`);
  } else {
    score += 20;
    if (password.length >= 12) score += 10; // Bonus for longer passwords
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter');
    suggestions.push('Add uppercase letters (A-Z)');
  } else {
    score += 15;
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push('Password must include at least one lowercase letter');
    suggestions.push('Add lowercase letters (a-z)');
  } else {
    score += 15;
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    errors.push('Password must include at least one number');
    suggestions.push('Add numbers (0-9)');
  } else {
    score += 15;
  }

  // Special characters are optional (bonus points only)
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 15;
  }

  // Check for common passwords (warning only, reduce score but don't block)
  const lowerPassword = password.toLowerCase();
  if (COMMON_PASSWORDS.some(common => lowerPassword === common)) {
    score -= 20;
    suggestions.push('Consider avoiding very common passwords');
  }

  // Check for sequences (warning only)
  if (SEQUENCES.some(seq => lowerPassword.includes(seq))) {
    score -= 10;
  }

  // Check for repeated patterns (warning only)
  if (/(.)\1{3,}/.test(password)) {
    score -= 10;
  }

  // Check for user-identifiable information (warning only)
  if (fullName) {
    const nameParts = fullName.toLowerCase().split(' ');
    if (nameParts.some(part => part.length > 2 && lowerPassword.includes(part))) {
      score -= 15;
      suggestions.push('Avoid using your name in passwords');
    }
  }

  if (email) {
    const emailUsername = email.split('@')[0].toLowerCase();
    if (emailUsername.length > 2 && lowerPassword.includes(emailUsername)) {
      score -= 15;
      suggestions.push('Avoid using your email in passwords');
    }
  }

  // Calculate character diversity bonus
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 10) score += 10;

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Determine strength
  let strength: 'weak' | 'moderate' | 'strong' | 'very-strong';
  if (score < 40) {
    strength = 'weak';
  } else if (score < 60) {
    strength = 'moderate';
  } else if (score < 80) {
    strength = 'strong';
  } else {
    strength = 'very-strong';
  }

  // Add positive suggestions if password is good
  if (errors.length === 0) {
    if (password.length < 16) {
      suggestions.push('Consider making it even longer for extra security');
    }
    if (uniqueChars < 12) {
      suggestions.push('Use more unique characters for better security');
    }
  }

  return {
    isValid: errors.length === 0,
    strength,
    score,
    errors,
    suggestions: suggestions.slice(0, 3), // Limit to top 3 suggestions
  };
}

/**
 * Get strength color for UI display
 */
export function getStrengthColor(strength: string): string {
  switch (strength) {
    case 'weak':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'moderate':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'strong':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'very-strong':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Get strength label for display
 */
export function getStrengthLabel(strength: string): string {
  switch (strength) {
    case 'weak':
      return 'Weak';
    case 'moderate':
      return 'Moderate';
    case 'strong':
      return 'Strong';
    case 'very-strong':
      return 'Very Strong';
    default:
      return 'Unknown';
  }
}

/**
 * Get progress bar width percentage
 */
export function getStrengthProgress(score: number): number {
  return Math.min(100, Math.max(0, score));
}
