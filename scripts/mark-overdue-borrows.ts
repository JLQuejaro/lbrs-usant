/**
 * Mark Overdue Borrows Script
 *
 * Updates all active borrow records past their due date to 'overdue' status.
 *
 * Usage:
 *   npm run db:mark-overdue
 *
 * For production: Schedule this to run daily via:
 *   - Windows Task Scheduler (local)
 *   - cron job (Linux/Mac)
 *   - Vercel Cron Jobs (when deployed)
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: '.env.local' });
config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function markOverdueBorrows() {
  try {
    console.log('[Overdue Check] Starting overdue borrows update...');

    const result = await prisma.borrowRecord.updateMany({
      where: {
        status: 'active',
        dueDate: {
          lt: new Date(),
        },
      },
      data: {
        status: 'overdue',
      },
    });

    console.log(`[Overdue Check] Complete. Updated ${result.count} borrow(s) to 'overdue' status.`);

    return result.count;
  } catch (error) {
    console.error('[Overdue Check] Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
markOverdueBorrows()
  .then((count) => {
    console.log(`[Overdue Check] Finished successfully.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('[Overdue Check] Failed:', error);
    process.exit(1);
  });
