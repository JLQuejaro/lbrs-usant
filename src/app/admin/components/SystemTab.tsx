import { Server, Lock } from 'lucide-react';

function HealthBar({ label, status, value, color }: { label: string; status: string; value: number; color: string; }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-xs font-bold text-gray-500">{status}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

export default function SystemTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Server size={20} className="text-purple-600" /> Infrastructure Status
          </h3>
          <div className="space-y-6">
            <HealthBar label="API Engine" status="Online" value={100} color="bg-green-500" />
            <HealthBar label="Database Cluster" status="Healthy" value={98} color="bg-green-500" />
            <HealthBar label="Storage (S3)" status="Warning" value={82} color="bg-amber-500" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lock size={20} className="text-blue-600" /> Security Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Two-Factor Auth</span>
              <div className="w-10 h-5 bg-green-500 rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Auto-Logout (15m)</span>
              <div className="w-10 h-5 bg-green-500 rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">API IP Whitelist</span>
              <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-8 rounded-2xl text-white shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-1">Maintenance Mode</h3>
          <p className="text-gray-400 text-sm">Disables public access for system updates</p>
        </div>
        <button className="px-6 py-2 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition">
          Activate Now
        </button>
      </div>
    </div>
  );
}
