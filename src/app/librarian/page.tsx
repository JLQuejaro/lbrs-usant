// src/app/librarian/page.tsx
"use client";

import Navbar from '@/app/components/Navbar';
import AddBookModal from '@/app/components/AddBookModal';
import { 
  Book as BookIcon, Users, Layers, Plus, Search, Edit, Trash2, CheckCircle, XCircle, 
  TrendingUp, FileText, ShoppingBag, Star, AlertCircle, BarChart3, Clock, ArrowRight 
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { ALL_BOOKS, MOCK_USERS, Book, User } from '@/app/lib/mockData';

export default function LibrarianDashboard() {
  const [activeTab, setActiveTab] = useState<'Inventory' | 'Borrowing' | 'Reports' | 'Users' | 'Acquisition'>('Inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>(ALL_BOOKS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const handleAddBook = (newBook: any) => {
    setBooks([newBook, ...books]);
  };

  const toggleFeatured = (id: number) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, featured: !b.featured } : b));
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularBooks = [...books].sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 5);
  const trendingBooks = [...books].sort((a, b) => b.views - a.views).slice(0, 5);
  
  // Suggestions: Books with high views but low borrow count or missing genres
  const suggestions = books
    .filter(b => b.views > 500 && b.borrowCount < 50)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <AddBookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddBook} 
      />

      <main className="max-w-7xl mx-auto px-8 py-10">
        
        {/* Page Title & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Librarian Console</h1>
            <p className="text-gray-500 mt-1">Manage library collection and operations</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 overflow-x-auto no-scrollbar">
            {['Inventory', 'Borrowing', 'Reports', 'Users', 'Acquisition'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
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

        {/* --- TAB: INVENTORY --- */}
        {activeTab === 'Inventory' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <StatCard icon={<BookIcon size={24} className="text-usant-red" />} label="Total Titles" value={books.length.toString()} color="bg-red-50" />
              <StatCard icon={<CheckCircle size={24} className="text-green-600" />} label="Available" value={books.filter(b => b.stock).length.toString()} color="bg-green-50" />
              <StatCard icon={<AlertCircle size={24} className="text-amber-600" />} label="Borrowed" value={books.filter(b => !b.stock).length.toString()} color="bg-amber-50" />
              <StatCard icon={<Star size={24} className="text-purple-600" />} label="Featured" value={books.filter(b => b.featured).length.toString()} color="bg-purple-50" />
            </div>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full max-w-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by title, author, or ISBN..." 
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-usant-red shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full md:w-auto bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
                >
                    <Plus size={20} /> Add Material
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Material</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Analytics</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Promote</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50/80 transition group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 group-hover:text-usant-red transition">{book.title}</div>
                        <div className="text-xs text-gray-500">{book.author} • {book.genre}</div>
                      </td>
                      <td className="px-6 py-4">
                        {book.stock ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                            Borrowed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span title="Borrows"><TrendingUp size={12} className="inline mr-1"/> {book.borrowCount}</span>
                          <span title="Views"><BarChart3 size={12} className="inline mr-1"/> {book.views}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleFeatured(book.id)}
                          className={`p-2 rounded-lg transition-all ${
                            book.featured 
                            ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
                            : 'text-gray-300 hover:text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <Star size={18} fill={book.featured ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition"><Edit size={16} /></button>
                          <button className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBooks.length === 0 && (
                <div className="p-12 text-center text-gray-500 bg-gray-50/50">
                    <Search className="mx-auto mb-4 opacity-20" size={48} />
                    <p className="font-medium text-gray-900">No materials found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB: BORROWING (Analytics) --- */}
        {activeTab === 'Borrowing' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Most Borrowed */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-usant-red" size={20} /> Most Borrowed Titles
                </h3>
                <div className="space-y-4">
                  {popularBooks.map((book, idx) => (
                    <div key={book.id} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">{idx + 1}</div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900 line-clamp-1">{book.title}</div>
                        <div className="text-xs text-gray-500">{book.author}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-usant-red">{book.borrowCount}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Loans</div>
                      </div>
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-usant-red rounded-full" 
                          style={{ width: `${(book.borrowCount / popularBooks[0].borrowCount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Genres (Mock Charts) */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Layers className="text-orange-500" size={20} /> Popular Genres
                </h3>
                <div className="space-y-6">
                  <GenreBar label="Computer Science" count={145} color="bg-red-500" max={200} />
                  <GenreBar label="Software Engineering" count={98} color="bg-blue-500" max={200} />
                  <GenreBar label="Business" count={76} color="bg-emerald-500" max={200} />
                  <GenreBar label="Mathematics" count={54} color="bg-amber-500" max={200} />
                  <GenreBar label="History" count={32} color="bg-purple-500" max={200} />
                </div>
              </div>

            </div>

            {/* Borrowing Activity Trends */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-gray-900 text-lg">Borrowing Activity (Last 7 Days)</h3>
                <select className="text-sm border-gray-200 rounded-lg p-1 text-gray-500">
                   <option>Weekly View</option>
                   <option>Monthly View</option>
                </select>
              </div>
              <div className="flex items-end justify-between h-48 gap-4 px-4">
                <TrendBar day="Mon" height="60%" />
                <TrendBar day="Tue" height="85%" />
                <TrendBar day="Wed" height="45%" />
                <TrendBar day="Thu" height="70%" />
                <TrendBar day="Fri" height="95%" />
                <TrendBar day="Sat" height="30%" />
                <TrendBar day="Sun" height="20%" />
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: REPORTS --- */}
        {activeTab === 'Reports' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ReportCard 
                title="Overdue Materials" 
                count="24" 
                subtitle="Items requiring immediate attention" 
                status="urgent"
                icon={<Clock size={24} />}
              />
              <ReportCard 
                title="Most Borrowed (MTD)" 
                count="156" 
                subtitle="Monthly borrowing volume" 
                status="good"
                icon={<TrendingUp size={24} />}
              />
              <ReportCard 
                title="Low Circulation" 
                count="42" 
                subtitle="Materials not borrowed in 6+ months" 
                status="info"
                icon={<BarChart3 size={24} />}
              />
            </div>

            {/* Detailed Lists */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Daily Transactions Log</h3>
                <button className="text-usant-red text-sm font-bold flex items-center gap-1 hover:underline">
                  Export PDF <FileText size={14} />
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { user: 'John Student', book: 'Clean Code', action: 'Returned', time: '10:15 AM', status: 'On Time' },
                  { user: 'Maria Santos', book: 'Introduction to Algorithms', action: 'Borrowed', time: '09:45 AM', status: 'Active' },
                  { user: 'Alice Smith', book: 'Deep Work', action: 'Overdue', time: '09:00 AM', status: 'Penalty' },
                  { user: 'Bob Brown', book: 'Design Patterns', action: 'Returned', time: 'Yesterday', status: 'On Time' },
                ].map((log, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex gap-4 items-center">
                      <div className={`w-2 h-2 rounded-full ${log.action === 'Borrowed' ? 'bg-blue-500' : log.action === 'Overdue' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{log.user}</div>
                        <div className="text-xs text-gray-500">{log.book}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">{log.action}</div>
                      <div className="text-xs text-gray-400 font-mono">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: USERS --- */}
        {activeTab === 'Users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
             <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative flex-1 max-w-md">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                     type="text" 
                     placeholder="Search patrons by name or ID..." 
                     className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-usant-red/20"
                   />
                </div>
                <div className="flex gap-3">
                  <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition">Bulk Upload</button>
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-black transition">
                     <Plus size={16} /> New User
                  </button>
                </div>
             </div>

             <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                   <tr>
                      <th className="px-6 py-4">Patron</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition group">
                         <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase border bg-white text-gray-600 border-gray-200">
                               {user.role}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                               <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-usant-red p-1"><ArrowRight size={16}/></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* --- TAB: ACQUISITION --- */}
        {activeTab === 'Acquisition' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
             <div className="bg-gradient-to-r from-usant-red to-usant-orange p-8 rounded-2xl text-white shadow-lg">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <ShoppingBag size={28} /> Smart Acquisition Suggestions
                </h3>
                <p className="opacity-90 max-w-2xl">
                  Our system analyzes student search patterns and borrowing trends to suggest materials that will fill gaps in your collection.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {suggestions.map((item) => (
                   <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:border-usant-red/30 transition">
                      <div className="mb-4 p-3 bg-red-50 rounded-xl w-fit">
                         <AlertCircle className="text-usant-red" size={24} />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500 mb-4">{item.author}</p>
                      
                      <div className="mt-auto space-y-3">
                         <div className="flex justify-between text-xs font-bold">
                            <span className="text-gray-400">DEMAND LEVEL</span>
                            <span className="text-usant-red">HIGH</span>
                         </div>
                         <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-usant-red w-full"></div>
                         </div>
                         <p className="text-[11px] text-gray-500 italic">
                            Currently has {item.views} views but only {item.borrowCount} total copies. Recommend adding 2 more copies.
                         </p>
                         <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition">
                            Approve Purchase
                         </button>
                      </div>
                   </div>
                ))}

                {/* Gap Analysis */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col border-dashed">
                   <div className="mb-4 p-3 bg-blue-50 rounded-xl w-fit">
                      <Layers className="text-blue-500" size={24} />
                   </div>
                   <h4 className="font-bold text-gray-900 mb-1">Subject Gap Analysis</h4>
                   <p className="text-sm text-gray-500 mb-4">Under-represented subjects</p>
                   
                   <div className="space-y-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                         <div className="text-xs font-bold text-gray-700">Cybersecurity</div>
                         <div className="text-[10px] text-gray-400">Requested 12x this month • 0 books</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                         <div className="text-xs font-bold text-gray-700">Data Science</div>
                         <div className="text-[10px] text-gray-400">Requested 8x this month • 2 books</div>
                      </div>
                   </div>
                   
                   <button className="w-full mt-auto py-2 border-2 border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition">
                      Generate Gap Report
                   </button>
                </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
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

function GenreBar({ label, count, color, max }: { label: string, count: number, color: string, max: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-400">{count}</span>
      </div>
      <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000`} 
          style={{ width: `${(count / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

function TrendBar({ day, height }: { day: string, height: string }) {
  return (
    <div className="flex flex-col items-center flex-1 gap-2 group">
      <div className="w-full bg-gray-50 rounded-lg relative h-full flex items-end overflow-hidden border border-gray-50">
        <div 
          className="w-full bg-gradient-to-t from-usant-red to-usant-orange rounded-t-lg transition-all duration-700 group-hover:from-usant-red group-hover:to-red-600" 
          style={{ height }}
        ></div>
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase">{day}</span>
    </div>
  );
}

function ReportCard({ title, count, subtitle, status, icon }: any) {
  const statusColors = {
    urgent: 'text-red-600 bg-red-50 border-red-100',
    good: 'text-green-600 bg-green-50 border-green-100',
    info: 'text-blue-600 bg-blue-50 border-blue-100'
  };

  return (
    <div className={`p-6 rounded-2xl border ${statusColors[status as keyof typeof statusColors]} flex flex-col gap-4 shadow-sm`}>
      <div className="flex justify-between items-start">
        <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
        <span className="text-3xl font-bold">{count}</span>
      </div>
      <div>
        <h4 className="font-bold text-sm uppercase tracking-wider opacity-80">{title}</h4>
        <p className="text-xs mt-1 opacity-70">{subtitle}</p>
      </div>
    </div>
  );
}
