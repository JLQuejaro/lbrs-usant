import { Clock } from 'lucide-react';

export default function AuditLogsTab() {
  const logs = [
    { user: 'Admin User', action: 'Changed User Permissions', time: '5 mins ago', type: 'security' },
    { user: 'System', action: 'Database Backup Completed', time: '1 hour ago', type: 'system' },
    { user: 'Maria Santos', action: 'Deleted Book ID #42', time: '2 hours ago', type: 'admin' },
    { user: 'Admin User', action: 'Added New Librarian Account', time: 'Yesterday', type: 'admin' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-right duration-300">
      <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock size={20} className="text-usant-red" /> Recent Activity Timeline
      </h3>
      <div className="space-y-6 relative">
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>
        {logs.map((log, i) => (
          <div key={i} className="relative pl-10">
            <div className={`absolute left-2 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
              log.type === 'security' ? 'bg-red-500' : 
              log.type === 'system' ? 'bg-gray-500' : 'bg-blue-500'
            }`}></div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-usant-red/30 transition">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-gray-900 text-sm">{log.user}</span>
                <span className="text-xs text-gray-400 font-mono">{log.time}</span>
              </div>
              <p className="text-gray-600 text-sm">{log.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
