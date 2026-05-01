import { UserCheck, XCircle, CheckCircle, Hourglass, FileCheck, Download } from 'lucide-react';

interface UiAccountRequest {
  id: string;
  name: string;
  email: string;
  requestedRole: string;
  userType: string;
  course?: string;
  department?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  idDocument?: string;
}

export default function ReviewModal({ 
  request, 
  onClose, 
  onSubmit,
  reviewNotes,
  setReviewNotes,
  reviewError,
  isSubmitting
}: { 
  request: UiAccountRequest, 
  onClose: () => void,
  onSubmit: (status: 'approved' | 'rejected') => void,
  reviewNotes: string,
  setReviewNotes: (notes: string) => void,
  reviewError: string | null,
  isSubmitting: boolean
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              request.requestedRole === 'faculty' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
            }`}>
              <UserCheck size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Account Request Details</h3>
              <p className="text-xs text-gray-500">{request.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase flex items-center gap-2 ${
              request.status === 'pending' 
                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                : request.status === 'approved'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {request.status === 'pending' && <Hourglass size={16} />}
              {request.status === 'approved' && <CheckCircle size={16} />}
              {request.status === 'rejected' && <XCircle size={16} />}
              {request.status} Request
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Applicant Name</label>
              <p className="font-bold text-gray-900 mt-1">{request.name}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
              <p className="font-bold text-gray-900 mt-1">{request.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Requested Role</label>
              <p className="font-bold text-gray-900 mt-1 capitalize">{request.requestedRole}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">User Type</label>
              <p className="font-bold text-gray-900 mt-1">{request.userType}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {request.requestedRole === 'faculty' ? 'Department' : 'Course'}
              </label>
              <p className="font-bold text-gray-900 mt-1">{request.course || request.department || 'N/A'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Request Date</label>
              <p className="font-bold text-gray-900 mt-1">
                {new Date(request.requestedAt).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {request.idDocument && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <label className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <FileCheck size={12} /> Submitted Document
              </label>
              <div className="flex items-center justify-between mt-2">
                <p className="font-medium text-blue-900">{request.idDocument}</p>
                <button className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1">
                  <Download size={12} /> Download
                </button>
              </div>
            </div>
          )}

          {request.reviewedBy && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Review Information</label>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Reviewed by:</span> {request.reviewedBy}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Reviewed at:</span> {new Date(request.reviewedAt!).toLocaleString()}
                </p>
                {request.reviewNotes && (
                  <div className="mt-2 p-2 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Notes</p>
                    <p className="text-sm text-gray-700">{request.reviewNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {request.status === 'pending' && (
            <div className="border-t border-gray-100 pt-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Review Notes (Optional)</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                disabled={isSubmitting}
                placeholder="Add any notes about this approval/rejection..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-usant-red/20 resize-none h-24"
              />
              {reviewError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {reviewError}
                </div>
              )}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => onSubmit('approved')}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> {isSubmitting ? 'Saving...' : 'Approve Account'}
                </button>
                <button
                  onClick={() => onSubmit('rejected')}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <XCircle size={18} /> {isSubmitting ? 'Saving...' : 'Reject Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
