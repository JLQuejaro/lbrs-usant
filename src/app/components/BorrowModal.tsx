// src/components/BorrowModal.tsx
"use client";

import { CheckCircle, Calendar, X, BookOpen, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  bookId: number;
}

export default function BorrowModal({ isOpen, onClose, bookTitle, bookId }: BorrowModalProps) {
  const { token, user } = useAuth();
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [error, setError] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const fallbackDueDate = useMemo(() => {
    const today = new Date();
    const calculated = new Date(today);
    const defaultDays = user?.role === 'faculty' ? 30 : 7;
    calculated.setDate(today.getDate() + defaultDays);
    return calculated;
  }, [user?.role]);

  if (!isOpen) return null;

  const handleConfirmBorrow = async () => {
    if (!token) {
      setError('You must be logged in to borrow books.');
      return;
    }

    setIsBorrowing(true);
    setError('');
    try {
      const response = await fetch('/api/borrows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to borrow book');
      }

      if (data?.dueDate) {
        setDueDate(new Date(data.dueDate));
      }

      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to borrow book');
    } finally {
      setIsBorrowing(false);
    }
  };

  const handleClose = () => {
    setStep('confirm');
    setError('');
    setDueDate(null);
    onClose();
  };

  const effectiveDueDate = dueDate || fallbackDueDate;
  const formattedDate = effectiveDueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const durationDays = Math.max(1, Math.round((effectiveDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const durationLabel = `${durationDays} day${durationDays === 1 ? '' : 's'}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {step === 'confirm' ? (
        <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 relative">
          
          {/* Back Button inside Modal */}
          <button 
            onClick={handleClose}
            className="absolute top-4 left-4 p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-all border border-gray-100 hover:border-usant-red/30 cursor-pointer group"
            title="Go Back"
          >
            <ArrowLeft size={18} className="group-hover:text-usant-red transition-colors" />
          </button>

          <div className="p-8 pt-12">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 mx-auto">
              <BookOpen size={32} className="text-blue-600" />
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Borrowing</h2>
              <p className="text-gray-500 text-sm">
                You are about to borrow <span className="font-bold text-gray-900">"{bookTitle}"</span>. 
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8 flex gap-3">
              <AlertCircle size={20} className="text-blue-600 shrink-0" />
              <p className="text-sm text-blue-700 font-medium leading-relaxed">
                Standard period is <span className="font-bold">{durationLabel}</span>. Please return on or before <span className="font-bold">{formattedDate}</span>.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button 
              onClick={handleConfirmBorrow}
              disabled={isBorrowing}
              className="w-full py-4 bg-usant-red text-white font-bold rounded-xl hover:bg-red-800 transition shadow-lg shadow-red-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              {isBorrowing ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Processing...
                </>
              ) : (
                'Confirm & Borrow Now'
              )}
            </button>
            
            <button 
              onClick={handleClose}
              className="w-full mt-3 py-2 text-sm text-gray-400 font-medium hover:text-gray-600 transition"
            >
              Maybe later
            </button>
          </div>
        </div>
      ) : (
        /* Receipt Container */
        <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
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
                    <span>{durationLabel}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-400 text-center pt-2">
                Transaction ID: #LBRS-{Math.floor(Math.random() * 10000)}
              </div>
            </div>

            {/* UPDATED BACK BUTTON */}
            <button 
              onClick={handleClose}
              className="w-full mt-6 bg-usant-red hover:bg-red-800 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-red-100 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to Book Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
