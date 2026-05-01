import { TrendingUp, BarChart3, FileText } from 'lucide-react';

export default function AnalyticsTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-usant-red" /> Borrowing Trends
          </h3>
          <div className="h-64 flex items-end justify-between gap-4 px-4">
            <div className="flex-1 bg-usant-red/10 rounded-t-lg h-[40%] relative group">
              <div className="absolute inset-0 bg-usant-red rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex-1 bg-usant-red/10 rounded-t-lg h-[60%] relative group">
              <div className="absolute inset-0 bg-usant-red rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex-1 bg-usant-red/10 rounded-t-lg h-[85%] relative group">
              <div className="absolute inset-0 bg-usant-red rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex-1 bg-usant-red/10 rounded-t-lg h-[55%] relative group">
              <div className="absolute inset-0 bg-usant-red rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex-1 bg-usant-red/10 rounded-t-lg h-[75%] relative group">
              <div className="absolute inset-0 bg-usant-red rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <div className="flex justify-between mt-4 px-4 text-[10px] font-bold text-gray-400 uppercase">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-500" /> Usage by Role
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-600">Students</span>
                <span className="text-gray-900">72%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-usant-red w-[72%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-600">Faculty</span>
                <span className="text-gray-900">18%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[18%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-600">Staff</span>
                <span className="text-gray-900">10%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[10%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900">Generate Global Reports</h3>
          <FileText size={20} className="text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left hover:border-usant-red transition">
            <div className="font-bold text-sm mb-1">Annual Borrowing Report</div>
            <div className="text-xs text-gray-500">Comprehensive PDF summary</div>
          </button>
          <button className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left hover:border-usant-red transition">
            <div className="font-bold text-sm mb-1">User Activity Audit</div>
            <div className="text-xs text-gray-500">Security & login tracking</div>
          </button>
          <button className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left hover:border-usant-red transition">
            <div className="font-bold text-sm mb-1">Inventory Valuation</div>
            <div className="text-xs text-gray-500">Asset & collection metrics</div>
          </button>
        </div>
      </div>
    </div>
  );
}
