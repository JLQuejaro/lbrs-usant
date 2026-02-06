"use client";

import Navbar from '@/app/components/Navbar';
import { Users, Database, Activity, Shield, Search, Plus, Trash2, Edit, AlertTriangle, Clock } from 'lucide-react';
import { useState } from 'react';

// Mock Data: Users
const USERS_LIST = [
  { id: 1, name: 'John Student', email: 'student@usant.edu', role: 'Student', joined: 'Jan 15, 2024', status: 'Active' },
  { id: 2, name: 'Maria Santos', email: 'staff@usant.edu', role: 'Staff', joined: 'Jan 10, 2024', status: 'Active' },
  { id: 3, name: 'Dr. Johnson', email: 'faculty@usant.edu', role: 'Faculty', joined: 'Jan 05, 2024', status: 'Away' },
  { id: 4, name: 'Admin User', email: 'admin@usant.edu', role: 'Admin', joined: 'Jan 01, 2024', status: 'Active' },
];

// Mock Data: Audit Logs
const AUDIT_LOGS = [
  { id: 101, user: 'John Student', action: 'Borrowed "Clean Code"', time: '2 mins ago', type: 'borrow' },
  { id: 102, user: 'Maria Santos', action: 'Added new book "AI Ethics"', time: '15 mins ago', type: 'create' },
  { id: 103, user: 'Dr. Johnson', action: 'Failed login attempt', time: '1 hour ago', type: 'security' },
  { id: 104, user: 'System', action: 'Automated Database Backup', time: '2:00 AM', type: 'system' },
  { id: 105, user: 'Admin User', action: 'Updated User Permissions', time: 'Yesterday', type: 'admin' },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'Users' | 'Audit Logs' | 'Database'>('Users');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName="Admin User" userRole="System Administrator" />

      <main className="max-w-7xl mx-auto px-8 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500">Overview of system performance and user activity.</p>
          </div>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
             {['Users', 'Audit Logs', 'Database'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
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
          <StatCard icon={<Users size={24} className="text-blue-600" />} label="Total Users" value="128" color="bg-blue-50" />
          <StatCard icon={<Database size={24} className="text-purple-600" />} label="Books in DB" value="12,450" color="bg-purple-50" />
          <StatCard icon={<Activity size={24} className="text-orange-600" />} label="Daily Activity" value="+24%" color="bg-orange-50" />
          <StatCard icon={<Shield size={24} className="text-green-600" />} label="System Uptime" value="99.9%" color="bg-green-50" />
        </div>

        {/* === TAB 1: USERS === */}
        {activeTab === 'Users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
             {/* Toolbar */}
             <div className="p-6 border-b border-gray-100 flex justify-between items-center gap-4">
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
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-black transition">
                   <Plus size={16} /> Add User
                </button>
             </div>

             {/* Table */}
             <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                   <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {USERS_LIST.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                         <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold border ${
                               user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                               user.role === 'Student' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                               'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>
                               {user.role}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                         <td className="px-6 py-4">
                            <span className={`flex items-center gap-1.5 text-xs font-bold ${
                               user.status === 'Active' ? 'text-green-600' : 'text-gray-400'
                            }`}>
                               <span className={`w-2 h-2 rounded-full ${
                                  user.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
                               }`}></span>
                               {user.status}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-usant-red p-1"><Edit size={16}/></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* === TAB 2: AUDIT LOGS === */}
        {activeTab === 'Audit Logs' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-right duration-300">
             <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock size={20} className="text-usant-red" /> Recent Activity Timeline
             </h3>
             <div className="space-y-6 relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                {AUDIT_LOGS.map((log) => (
                   <div key={log.id} className="relative pl-10">
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
                         {log.type === 'security' && (
                            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                               <AlertTriangle size={12} /> Security Alert
                            </div>
                         )}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* === TAB 3: DATABASE (Updated to match Screenshot) === */}
        {activeTab === 'Database' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
            
            {/* Database Statistics Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Database Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1 */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                   <h4 className="text-sm text-gray-500 mb-1">Books Collection</h4>
                   <div className="text-3xl font-bold text-gray-900 mb-1">12 records</div>
                   <div className="text-xs text-gray-400">Last updated: Today</div>
                </div>
                {/* Card 2 */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                   <h4 className="text-sm text-gray-500 mb-1">Users Collection</h4>
                   <div className="text-3xl font-bold text-gray-900 mb-1">10 records</div>
                   <div className="text-xs text-gray-400">Last updated: Today</div>
                </div>
                {/* Card 3 */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                   <h4 className="text-sm text-gray-500 mb-1">Audit Logs</h4>
                   <div className="text-3xl font-bold text-gray-900 mb-1">10 records</div>
                   <div className="text-xs text-gray-400">Last updated: Today</div>
                </div>
                {/* Card 4 */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                   <h4 className="text-sm text-gray-500 mb-1">Total Records</h4>
                   <div className="text-3xl font-bold text-gray-900 mb-1">32</div>
                   <div className="text-xs text-gray-400">Across all collections</div>
                </div>
              </div>
            </div>

            {/* System Health Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">System Health</h3>
              
              <div className="space-y-6">
                {/* Database Connection */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Database Connection</span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Active</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full w-full"></div>
                  </div>
                </div>

                {/* API Response Time */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">API Response Time</span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">150ms</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full w-[85%]"></div>
                  </div>
                </div>

                {/* Storage Usage */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Storage Usage</span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">68%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-yellow-400 h-2.5 rounded-full w-[68%]"></div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

// Small Stat Card
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