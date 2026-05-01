import { Search, Plus, Edit, Trash2 } from 'lucide-react';

interface UiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function UsersTab({ users, searchTerm, setSearchTerm }: { users: UiUser[], searchTerm: string, setSearchTerm: (term: string) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
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
          {users.map((user) => (
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
                <span className={`flex items-center gap-1.5 text-xs font-bold ${user.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span> {user.isActive ? 'Active' : 'Inactive'}
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
  );
}
