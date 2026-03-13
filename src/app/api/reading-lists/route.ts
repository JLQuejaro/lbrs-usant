import { NextRequest, NextResponse } from 'next/server';
import { getReadingListsByFacultyId } from '@/app/lib/db-repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paramFacultyId = searchParams.get('facultyId');
    const headerUserId = request.headers.get('x-user-id');
    const facultyId = paramFacultyId || headerUserId;

    if (!facultyId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Faculty ID is required' },
        { status: 400 }
      );
    }

    const lists = await getReadingListsByFacultyId(facultyId);
    const mapped = lists.map(list => ({
      id: list.reading_list_id,
      title: list.title,
      facultyId: list.faculty_id,
      description: list.description,
      studentCount: list.student_count,
      isActive: list.is_active,
      createdAt: list.created_at,
      bookIds: list.book_ids || [],
    }));

    return NextResponse.json(
      { lists: mapped, count: mapped.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get reading lists error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get reading lists' },
      { status: 500 }
    );
  }
}
