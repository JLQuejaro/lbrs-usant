/**
 * Test script for rate limiting on /api/auth/login
 * Tests that 6+ attempts from one IP are blocked with 429 status
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const MAX_ATTEMPTS = parseInt(process.env.RATE_LIMIT_MAX || '5', 10);

async function testRateLimit() {
  console.log('🧪 Testing Rate Limiting on /api/auth/login\n');
  console.log(`Configuration:`);
  console.log(`  - Max attempts: ${MAX_ATTEMPTS}`);
  console.log(`  - Window: 15 minutes (900000ms)`);
  console.log(`  - Base URL: ${BASE_URL}\n`);

  const results = [];
  const testEmail = 'test@usant.edu.ph';
  const testPassword = 'wrongpassword';

  console.log(`Sending ${MAX_ATTEMPTS + 2} login attempts...\n`);

  for (let i = 1; i <= MAX_ATTEMPTS + 2; i++) {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });

      const data = await response.json();
      const status = response.status;

      results.push({ attempt: i, status, message: data.message || data.error });

      const emoji = status === 429 ? '🚫' : status === 401 || status === 403 ? '❌' : '✅';
      console.log(`${emoji} Attempt ${i}: Status ${status} - ${data.message || data.error}`);

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Attempt ${i} failed:`, error.message);
      results.push({ attempt: i, status: 'ERROR', message: error.message });
    }
  }

  console.log('\n📊 Test Results Summary:\n');

  const successfulAttempts = results.filter(r => r.status !== 429 && r.status !== 'ERROR');
  const blockedAttempts = results.filter(r => r.status === 429);
  const errorAttempts = results.filter(r => r.status === 'ERROR');

  console.log(`✅ Allowed attempts: ${successfulAttempts.length} (expected: ${MAX_ATTEMPTS})`);
  console.log(`🚫 Blocked attempts: ${blockedAttempts.length} (expected: ${MAX_ATTEMPTS + 2 - MAX_ATTEMPTS})`);
  console.log(`❌ Error attempts: ${errorAttempts.length}`);

  console.log('\n🎯 Rate Limiting Status:');
  
  if (successfulAttempts.length === MAX_ATTEMPTS && blockedAttempts.length >= 1) {
    console.log('✅ PASS - Rate limiting is working correctly!');
    console.log(`   - First ${MAX_ATTEMPTS} attempts were allowed`);
    console.log(`   - Subsequent attempts were blocked with 429 status`);
    return true;
  } else {
    console.log('❌ FAIL - Rate limiting is not working as expected!');
    if (successfulAttempts.length !== MAX_ATTEMPTS) {
      console.log(`   - Expected ${MAX_ATTEMPTS} allowed attempts, got ${successfulAttempts.length}`);
    }
    if (blockedAttempts.length === 0) {
      console.log(`   - No attempts were blocked with 429 status`);
    }
    return false;
  }
}

// Run the test
testRateLimit()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ Test failed with error:', error);
    process.exit(1);
  });
