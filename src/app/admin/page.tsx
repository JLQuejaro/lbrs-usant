// src/app/admin/page.tsx
"use client";

import Navbar from '@/app/components/Navbar';
import { 
  Users, Database, Activity, Shield, Search, Plus, Trash2, Edit, AlertTriangle, 
  Clock, TrendingUp, BarChart3, FileText, Settings, Server, Lock 
} from 'lucide-react';
import { useState } from 'react';
import { ALL_BOOKS, MOCK_USERS } from '@/app/lib/mockData';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'Users' | 'Audit Logs' | 'System' | 'Analytics'>('Users');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName="Admin User" userRole="System Administrator" />

      <main className="max-w-7xl mx-auto px-8 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Control</h1>
            <p className="text-gray-500">Root level management and performance monitoring.</p>
          </div>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 overflow-x-auto no-scrollbar">
             {['Users', 'Analytics', 'Audit Logs', 'System'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                   activeTab === tab 
                   ? 'bg-gradient-to-r from-usant-red to-usant-orange text-white shadow-md' 
                   : 'text-gray-500 hover:bg-gray-50'
                 }`}
               >
                 {tab}
               </button>
             ))}
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Users size={24} className="text-blue-600" />} label="Total Users" value={MOCK_USERS.length.toString()} color="bg-blue-50" />
          <StatCard icon={<Database size={24} className="text-purple-600" />} label="Total Books" value={ALL_BOOKS.length.toString()} color="bg-purple-50" />
          <StatCard icon={<Activity size={24} className="text-orange-600" />} label="System Load" value="12%" color="bg-orange-50" />
          <StatCard icon={<Shield size={24} className="text-green-600" />} label="Security" value="Active" color="bg-green-50" />
        </div>

        {/* === TAB: USERS === */}
        {activeTab === 'Users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
             {/* Toolbar */}
             <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative flex-1 max-w-md">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                     type="text" 
                     placeholder="Search users..." 
                     className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-usant-red/20"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <div className="flex gap-2">
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition">Import</button>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-black transition">
                        <Plus size={16} /> Add User
                    </button>
                </div>
             </div>

             {/* Table */}
             <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                   <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {MOCK_USERS.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                         <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold border uppercase ${
                               user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                               user.role === 'student' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                               'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>
                               {user.role}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                               <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button className="text-gray-400 hover:text-usant-red p-1"><Edit size={16}/></button>
                                <button className="text-gray-400 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* === TAB: ANALYTICS === */}
        {activeTab === 'Analytics' && (
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
        )}

        {/* === TAB: AUDIT LOGS === */}
        {activeTab === 'Audit Logs' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-right duration-300">
             <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock size={20} className="text-usant-red" /> Recent Activity Timeline
             </h3>
             <div className="space-y-6 relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                {[
                  { user: 'Admin User', action: 'Changed User Permissions', time: '5 mins ago', type: 'security' },
                  { user: 'System', action: 'Database Backup Completed', time: '1 hour ago', type: 'system' },
                  { user: 'Maria Santos', action: 'Deleted Book ID #42', time: '2 hours ago', type: 'admin' },
                  { user: 'Admin User', action: 'Added New Librarian Account', time: 'Yesterday', type: 'admin' },
                ].map((log, i) => (
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
        )}

        {/* === TAB: SYSTEM === */}
        {activeTab === 'System' && (
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
        )}

      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
       <div className={`p-3 rounded-xl ${color}`}>
          {icon}
       </div>
       <div>
          <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">{label}</p>
       </div>
    </div>
  );
}

function HealthBar({ label, status, value, color }: any) {
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
