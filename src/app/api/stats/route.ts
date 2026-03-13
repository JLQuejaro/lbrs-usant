import { NextResponse } from 'next/server';
import { getDatabaseStatistics } from '@/app/lib/db-repository';

export async function GET() {
  try {
    const stats = await getDatabaseStatistics();
    return NextResponse.json(
      { stats },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get stats' },
      { status: 500 }
    );
  }
}
