import { NextRequest, NextResponse } from 'next/server';
import { getAllAccountRequests, getPendingAccountRequests } from '@/app/lib/db-repository';

export async function GET(request: NextRequest) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const requests = status === 'pending'
      ? await getPendingAccountRequests()
      : await getAllAccountRequests();

    const mapped = requests
      .filter(req => !status || status === 'all' || req.status === status)
      .map(req => ({
        id: req.request_id,
        name: req.full_name,
        email: req.email,
        requestedRole: req.requested_role,
        userType: req.user_type,
        course: req.course,
        department: req.department,
        status: req.status,
        requestedAt: req.requested_at,
        reviewedBy: req.reviewed_by,
        reviewedAt: req.reviewed_at,
        reviewNotes: req.review_notes,
        idDocument: req.id_document_path,
      }));

    return NextResponse.json(
      { requests: mapped, count: mapped.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get account requests error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get account requests' },
      { status: 500 }
    );
  }
}
