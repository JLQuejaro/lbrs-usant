import { NextRequest, NextResponse } from 'next/server';
import { getJournals } from '@/app/lib/db-repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || undefined;

    const journals = await getJournals(subject);
    const mapped = journals.map(journal => ({
      id: journal.journal_id,
      title: journal.title,
      publisher: journal.publisher,
      subject: journal.subject,
      impactFactor: journal.impact_factor,
      accessUrl: journal.access_url,
      type: journal.journal_type,
    }));

    return NextResponse.json(
      { journals: mapped, count: mapped.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get journals error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get journals' },
      { status: 500 }
    );
  }
}
