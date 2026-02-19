"use client";

import Navbar from '@/app/components/Navbar';
import { Book as BookIcon, Clock, Calendar, AlertCircle, CheckCircle, RotateCcw, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLocalBorrows, returnBook, ALL_BOOKS, LocalBorrow } from '@/app/lib/mockData';

// Mock Data: Past History
const HISTORY = [
  { 
    id: 3, 
    title: 'Design Patterns', 
    author: 'Erich Gamma', 
    returnedDate: 'Jan 15, 2026', 
    status: 'Returned', 
    coverColor: 'bg-emerald-800' 
  },
  { 
    id: 4, 
    title: 'The Pragmatic Programmer', 
    author: 'Andrew Hunt', 
    returnedDate: 'Dec 10, 2025', 
    status: 'Returned', 
    coverColor: 'bg-slate-700' 
  }
];

export default function MyShelfPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [borrows, setBorrows] = useState<LocalBorrow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setBorrows(getLocalBorrows());
    setIsLoading(false);
  }, []);

  const handleReturn = (id: number) => {
    const updated = returnBook(id);
    setBorrows(updated);
  };

  const borrowedBooks = borrows.map(b => {
    const bookInfo = ALL_BOOKS.find(book => book.id === b.id);
    return {
      ...b,
      ...bookInfo,
      status: new Date(b.dueDate) < new Date() ? 'Overdue' : 'Active'
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName="John Student" userRole="Student" />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-usant-red to-usant-orange pt-12 pb-24 px-8 overflow-hidden relative">
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
            <Link href="/student#browse" className="text-white/80 hover:text-white transition font-bold text-sm">
              Back to Browse
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">My Bookshelf</h1>
          <p className="text-white/90 text-lg">
            Manage your current borrows and view your reading history.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* LEFT: Profile Card */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gray-900 h-24 relative">
                {/* Avatar */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white p-1 shadow-md">
                   <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-bold text-2xl">
                     JS
                   </div>
                </div>
              </div>
              <div className="pt-12 pb-6 px-6 text-center">
                <h2 className="text-xl font-bold text-gray-900">John Student</h2>
                <p className="text-sm text-gray-500 mb-4">4th Year • Computer Science</p>
                
                <div className="flex justify-center gap-2 mb-6">
                   <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                     <CheckCircle size={12} /> Good Standing
                   </span>
                </div>

                <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-left">
                   <div>
                     <span className="block text-xs text-gray-400 uppercase font-bold">Books Out</span>
                     <span className="block text-lg font-bold text-gray-900">{borrows.length}</span>
                   </div>
                   <div>
                     <span className="block text-xs text-gray-400 uppercase font-bold">Fines</span>
                     <span className="block text-lg font-bold text-gray-900">₱0.00</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Bookshelf Tabs */}
          <div className="md:col-span-8 lg:col-span-9">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
                
                {/* Tabs Header */}
                <div className="flex border-b border-gray-100">
                  <button 
                    onClick={() => setActiveTab('current')}
                    className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${
                        activeTab === 'current' 
                        ? 'border-usant-red text-usant-red bg-red-50/50' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Current Borrows ({borrows.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${
                        activeTab === 'history' 
                        ? 'border-usant-red text-usant-red bg-red-50/50' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Borrowing History
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  
                  {activeTab === 'current' && (
                    <div className="space-y-4">
                      {isLoading ? (
                        <div className="flex justify-center py-20">
                          <Loader2 size={32} className="text-usant-red animate-spin" />
                        </div>
                      ) : borrowedBooks.length > 0 ? borrowedBooks.map((book) => (
                        <div key={book.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition bg-white group">
                           {/* Tiny Cover */}
                           <div className={`w-16 h-24 sm:w-20 sm:h-28 ${book.color || 'bg-gray-200'} rounded-md shadow-sm flex-shrink-0`}></div>
                           
                           <div className="flex-1">
                             <h3 className="font-bold text-lg text-gray-900">{book.title}</h3>
                             <p className="text-sm text-gray-500 mb-3">{book.author}</p>
                             
                             <div className="flex flex-wrap gap-4 text-sm">
                               <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar size={16} className="text-gray-400" /> 
                                  <span>Borrowed: {new Date(book.borrowedDate!).toLocaleDateString()}</span>
                               </div>
                               <div className={`flex items-center gap-2 font-medium ${
                                   book.status === 'Overdue' ? 'text-red-600' : 'text-orange-600'
                               }`}>
                                  <Clock size={16} /> 
                                  <span>Due: {new Date(book.dueDate!).toLocaleDateString()}</span>
                               </div>
                             </div>
                           </div>

                           {/* Status & Action */}
                           <div className="flex flex-row sm:flex-col justify-between items-end gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  book.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {book.status}
                              </span>
                              <button 
                                onClick={() => handleReturn(book.id!)}
                                className="text-sm font-medium text-usant-red hover:underline flex items-center gap-1"
                              >
                                <RotateCcw size={14} /> Return
                              </button>
                           </div>
                        </div>
                      )) : (
                        <div className="text-center py-20">
                           <BookIcon size={48} className="text-gray-200 mx-auto mb-4" />
                           <h3 className="text-lg font-bold text-gray-900">Your shelf is empty</h3>
                           <p className="text-gray-500 mb-6">Explore the library and start borrowing books!</p>
                           <Link href="/student#browse" className="bg-usant-red text-white px-6 py-2 rounded-lg font-bold hover:bg-red-800 transition">
                              Browse Books
                           </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div className="space-y-4">
                       {HISTORY.map((book) => (
                        <div key={book.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 opacity-75 hover:opacity-100 transition">
                           <div className={`w-12 h-16 ${book.coverColor} rounded-md shadow-sm flex-shrink-0`}></div>
                           <div className="flex-1">
                             <h3 className="font-bold text-gray-900">{book.title}</h3>
                             <p className="text-xs text-gray-500">{book.author}</p>
                           </div>
                           <div className="text-right">
                              <span className="block text-xs text-gray-400 mb-1">Returned on</span>
                              <span className="block text-sm font-medium text-gray-700">{book.returnedDate}</span>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
