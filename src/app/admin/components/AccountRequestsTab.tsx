import { Search, Hourglass, CheckCircle, XCircle, Eye } from 'lucide-react';

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

export default function AccountRequestsTab({ 
  accountRequests, 
  searchTerm, 
  setSearchTerm, 
  requestFilter, 
  setRequestFilter,
  onViewRequest 
}: { 
  accountRequests: UiAccountRequest[], 
  searchTerm: string, 
  setSearchTerm: (term: string) => void,
  requestFilter: 'all' | 'pending' | 'approved' | 'rejected',
  setRequestFilter: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void,
  onViewRequest: (request: UiAccountRequest) => void
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setRequestFilter(filter)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all capitalize ${
                requestFilter === filter
                  ? 'bg-white text-usant-red shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search requests..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-usant-red/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
          <tr>
            <th className="px-6 py-4">Applicant</th>
            <th className="px-6 py-4">Requested Role</th>
            <th className="px-6 py-4">Department/Course</th>
            <th className="px-6 py-4">Request Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {accountRequests.filter(req => {
            if (requestFilter !== 'all' && req.status !== requestFilter) return false;
            if (searchTerm && !req.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !req.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
          }).map((request) => (
            <tr key={request.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4">
                <div className="font-bold text-gray-900">{request.name}</div>
                <div className="text-xs text-gray-500">{request.email}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold border uppercase ${
                  request.requestedRole === 'faculty' 
                    ? 'bg-blue-50 text-blue-700 border-blue-100' 
                    : request.requestedRole === 'student'
                    ? 'bg-orange-50 text-orange-700 border-orange-100'
                    : 'bg-purple-50 text-purple-700 border-purple-100'
                }`}>
                  {request.requestedRole}
                </span>
                <div className="text-xs text-gray-500 mt-1">{request.userType}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-700">
                  {request.course || request.department || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-xs text-gray-500">
                  {new Date(request.requestedAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </div>
                <div className="text-[10px] text-gray-400">
                  {new Date(request.requestedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit ${
                  request.status === 'pending' 
                    ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                    : request.status === 'approved'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {request.status === 'pending' && <Hourglass size={10} />}
                  {request.status === 'approved' && <CheckCircle size={10} />}
                  {request.status === 'rejected' && <XCircle size={10} />}
                  {request.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onViewRequest(request)}
                    className="text-gray-400 hover:text-blue-600 p-1 transition"
                    title="View Details"
                  >
                    <Eye size={16}/>
                  </button>
                  {request.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => onViewRequest(request)}
                        className="text-gray-400 hover:text-green-600 p-1 transition"
                        title="Approve"
                      >
                        <CheckCircle size={16}/>
                      </button>
                      <button 
                        onClick={() => onViewRequest(request)}
                        className="text-gray-400 hover:text-red-600 p-1 transition"
                        title="Reject"
                      >
                        <XCircle size={16}/>
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
