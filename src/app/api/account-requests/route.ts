import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import {
  approveAccountRequest,
  getAllAccountRequests,
  getPendingAccountRequests,
  rejectAccountRequest,
} from '@/app/lib/db-repository';

function mapAccountRequest(request: Awaited<ReturnType<typeof getAllAccountRequests>>[number]) {
  return {
    id: request.request_id,
    name: request.full_name,
    email: request.email,
    requestedRole: request.requested_role,
    userType: request.user_type,
    course: request.course,
    department: request.department,
    status: request.status,
    requestedAt: request.requested_at,
    reviewedBy: request.reviewed_by,
    reviewedAt: request.reviewed_at,
    reviewNotes: request.review_notes,
    idDocument: request.id_document_path,
  };
}

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
      .map(mapAccountRequest);

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

export async function PATCH(request: NextRequest) {
  try {
    const role = request.headers.get('x-user-role');
    const reviewerId = request.headers.get('x-user-id');

    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin access required' },
        { status: 403 }
      );
    }

    if (!reviewerId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No reviewer identity in request' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const body = await request.json();
    const requestId = searchParams.get('id') ?? body?.id;
    const status = body?.status;
    const reviewNotes = typeof body?.reviewNotes === 'string' ? body.reviewNotes.trim() : '';

    if (!requestId || typeof requestId !== 'string') {
      return NextResponse.json(
        { error: 'Bad Request', message: 'A valid request id is required' },
        { status: 400 }
      );
    }

    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json(
        { error: 'Bad Request', message: 'status must be either approved or rejected' },
        { status: 400 }
      );
    }

    const updatedRequest = status === 'approved'
      ? await approveAccountRequest(requestId, reviewerId, reviewNotes || undefined)
      : await rejectAccountRequest(
          requestId,
          reviewerId,
          reviewNotes || 'Rejected by administrator.'
        );

    return NextResponse.json(
      {
        message: `Account request ${status} successfully`,
        request: updatedRequest ? mapAccountRequest(updatedRequest) : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Review account request error:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Not Found', message: 'Account request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to review account request' },
      { status: 500 }
    );
  }
}
