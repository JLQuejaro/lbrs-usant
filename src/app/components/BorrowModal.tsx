// src/components/BorrowModal.tsx
"use client";

import { CheckCircle, Calendar, X, BookOpen } from 'lucide-react';

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
}

export default function BorrowModal({ isOpen, onClose, bookTitle }: BorrowModalProps) {
  if (!isOpen) return null;

  // Calculate Due Date (7 days from now)
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + 7);
  const formattedDate = dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Receipt Container */}
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* Success Header */}
        <div className="bg-green-600 p-6 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold">Borrow Successful!</h2>
            <p className="text-green-100 text-sm">Happy Reading!</p>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 relative">
          {/* Jagged Line Effect (CSS mask would be complex, using simple border dashed for demo) */}
          <div className="absolute top-0 left-0 right-0 h-px border-t-2 border-dashed border-gray-300"></div>

          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Book Title</label>
              <p className="text-lg font-bold text-gray-900 leading-tight">{bookTitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Due Date</label>
                <div className="flex items-center gap-2 text-usant-red font-bold">
                  <Calendar size={16} />
                  <span>{formattedDate}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Duration</label>
                <div className="flex items-center gap-2 text-gray-700 font-bold">
                  <BookOpen size={16} />
                  <span>7 Days</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400 text-center pt-2">
              Transaction ID: #LBRS-{Math.floor(Math.random() * 10000)}
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-6 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
}