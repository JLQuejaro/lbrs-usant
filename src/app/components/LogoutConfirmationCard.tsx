"use client";

import { LogOut } from 'lucide-react';
import { useEffect } from 'react';

interface LogoutConfirmationCardProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function LogoutConfirmationCard({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  isLoading = false 
}: LogoutConfirmationCardProps) {
  
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Overlay
    <div 
      className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
      onClick={!isLoading ? onCancel : undefined}
    >
      {/* Box-shaped Card: Fixed width, centered content, tight padding */}
      <div 
        className="bg-white rounded-2xl shadow-2xl w-72 p-6 flex flex-col items-center justify-center text-center relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Centered Icon */}
        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4 border border-red-100">
          <LogOut size={28} className="text-usant-red translate-x-0.5" />
        </div>
        
        {/* Short Text */}
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Sign Out?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to leave?
        </p>

        {/* Compact Action Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-usant-red text-white text-sm font-bold rounded-xl hover:bg-red-800 transition-colors shadow-md shadow-red-200 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? '...' : 'Logout'}
          </button>
        </div>

      </div>
    </div>
  );
}