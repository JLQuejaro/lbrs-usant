import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config({ path: '.env.local' });
config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function rehashPlaintextPasswords() {
  console.log('🔍 Auditing database for plaintext passwords...');

  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });

    let plaintextCount = 0;
    let rehashedCount = 0;

    for (const user of users) {
      // Check if password is NOT a bcrypt hash (bcrypt hashes start with $2a$, $2b$, or $2y$)
      if (!user.passwordHash.match(/^\$2[aby]\$/)) {
        plaintextCount++;
        console.log(`⚠️  Found plaintext password for user: ${user.email}`);

        // Hash the plaintext password
        const hashedPassword = await bcrypt.hash(user.passwordHash, 10);

        // Update the user with the hashed password
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: hashedPassword },
        });

        rehashedCount++;
        console.log(`✅ Rehashed password for user: ${user.email}`);
      }
    }

    console.log('\n📊 Audit Summary:');
    console.log(`   Total users: ${users.length}`);
    console.log(`   Plaintext passwords found: ${plaintextCount}`);
    console.log(`   Passwords rehashed: ${rehashedCount}`);

    if (plaintextCount === 0) {
      console.log('✅ All passwords are properly hashed!');
    } else {
      console.log('✅ All plaintext passwords have been rehashed!');
    }
  } catch (error) {
    console.error('❌ Error during password audit:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

rehashPlaintextPasswords();
