"use client";

import Navbar from '@/app/components/Navbar';
import { History, Calendar, CheckCircle, ArrowLeft, Loader2, Filter, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

interface BorrowRecord {
  id: number;
  bookId: number;
  title?: string;
  author?: string;
  color?: string;
  borrowedDate: string;
  dueDate: string;
  returnedDate?: string;
  status: string;
  username?: string;
  email?: string;
}

export default function AdminUserHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const { token } = useAuth();
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'returned' | 'active'>('all');
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    if (!token || !userId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const loadData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/borrows?status=${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted) {
          setBorrows(data.borrows || []);
          if (data.borrows && data.borrows.length > 0) {
            setUserName(data.borrows[0].username || 'User');
          }
        }
      } catch (error) {
        console.error('Failed to load user borrow history:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [token, userId, filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 pt-12 pb-24 px-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition backdrop-blur-sm border border-white/20 cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft size={18} />
            </button>
            <Link href="/admin" className="text-white/80 hover:text-white transition font-bold text-sm">
              Back to Admin Panel
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <User size={32} className="text-white" />
            <h1 className="text-4xl font-bold text-white">User Borrow History</h1>
          </div>
          <p className="text-white/90 text-lg">
            Viewing complete borrowing history for {userName}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-16 pb-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 min-h-[500px]">
          
          {/* Header with Filter */}
          <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <History size={24} className="text-gray-700" />
              Borrow Records ({borrows.length})
            </h2>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'returned' | 'active')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-700/20"
              >
                <option value="all">All Records</option>
                <option value="active">Active Only</option>
                <option value="returned">Returned Only</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 size={32} className="text-gray-700 animate-spin" />
                </div>
              ) : borrows.length > 0 ? borrows.map((borrow) => {
                const isReturned = borrow.status === 'returned';
                const isOverdue = !isReturned && new Date(borrow.dueDate) < new Date();
                return (
                <div key={borrow.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition bg-white group">
                   {/* Book Cover */}
                   <div className={`w-16 h-24 sm:w-20 sm:h-28 ${borrow.color || 'bg-gray-200'} rounded-md shadow-sm flex-shrink-0`}></div>
                   
                   <div className="flex-1">
                     <h3 className="font-bold text-lg text-gray-900">{borrow.title}</h3>
                     <p className="text-sm text-gray-500 mb-3">{borrow.author}</p>
                     
                     <div className="flex flex-wrap gap-4 text-sm">
                       <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} className="text-gray-400" /> 
                          <span>Borrowed: {new Date(borrow.borrowedDate).toLocaleDateString()}</span>
                       </div>
                       <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          <Calendar size={16} className="text-gray-400" /> 
                          <span>Due: {new Date(borrow.dueDate).toLocaleDateString()}</span>
                       </div>
                       {isReturned && borrow.returnedDate && (
                         <div className="flex items-center gap-2 text-green-600 font-medium">
                            <CheckCircle size={16} /> 
                            <span>Returned: {new Date(borrow.returnedDate).toLocaleDateString()}</span>
                         </div>
                       )}
                     </div>
                   </div>

                   {/* Status Badge */}
                   <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isReturned 
                          ? 'bg-green-100 text-green-700' 
                          : isOverdue
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {isReturned ? 'Returned' : isOverdue ? 'Overdue' : 'Active'}
                      </span>
                   </div>
                </div>
              );
              }) : (
                <div className="text-center py-20">
                   <History size={48} className="text-gray-200 mx-auto mb-4" />
                   <h3 className="text-lg font-bold text-gray-900">No borrow history</h3>
                   <p className="text-gray-500 mb-6">This user hasn't borrowed any books yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
