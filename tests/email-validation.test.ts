/**
 * Email Domain Validation Tests
 * Run with: node --loader ts-node/esm tests/email-validation.test.ts
 */

import { isValidUniversityEmail, getEmailDomainError } from '../src/app/lib/email-validation';

interface TestCase {
  email: string;
  expected: boolean;
  description: string;
}

const testCases: TestCase[] = [
  // Valid cases
  { email: 'student@usant.edu.ph', expected: true, description: 'Valid student email' },
  { email: 'faculty@usant.edu.ph', expected: true, description: 'Valid faculty email' },
  { email: 'admin@usant.edu.ph', expected: true, description: 'Valid admin email' },
  { email: 'ADMIN@USANT.EDU.PH', expected: true, description: 'Valid email (uppercase)' },
  
  // Invalid cases
  { email: 'user@gmail.com', expected: false, description: 'Gmail address' },
  { email: 'user@yahoo.com', expected: false, description: 'Yahoo address' },
  { email: 'user@usant.edu', expected: false, description: 'Missing .ph extension' },
  { email: 'user@usant.edu.ph.fake.com', expected: false, description: 'Fake domain suffix' },
  { email: 'user@student.usant.edu.ph', expected: false, description: 'Subdomain attempt' },
  { email: 'user@usant.edu.phishing.com', expected: false, description: 'Phishing attempt' },
  { email: 'user@usantedu.ph', expected: false, description: 'Missing dots' },
  { email: '', expected: false, description: 'Empty email' },
  { email: 'notanemail', expected: false, description: 'Invalid format' },
];

console.log('🧪 Running Email Domain Validation Tests\n');
console.log('=' .repeat(60));

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  const result = isValidUniversityEmail(test.email);
  const status = result === test.expected ? '✓ PASS' : '✗ FAIL';
  const icon = result === test.expected ? '✓' : '✗';
  
  if (result === test.expected) {
    passed++;
  } else {
    failed++;
  }
  
  console.log(`${icon} Test ${index + 1}: ${test.description}`);
  console.log(`  Email: "${test.email}"`);
  console.log(`  Expected: ${test.expected}, Got: ${result}`);
  console.log(`  Status: ${status}\n`);
});

console.log('=' .repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
console.log(`\n📝 Error Message: "${getEmailDomainError()}"`);

if (failed === 0) {
  console.log('\n✅ All tests passed!');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed!');
  process.exit(1);
}
