// src/components/AddBookModal.tsx
"use client";

import { X, BookOpen, Check } from 'lucide-react';
import { useState } from 'react';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: any) => void;
}

export default function AddBookModal({ isOpen, onClose, onSave }: AddBookModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'Computer Science',
    year: new Date().getFullYear().toString()
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: Date.now() }); // Create a temp ID
    onClose();
    // Reset form
    setFormData({ title: '', author: '', genre: 'Computer Science', year: new Date().getFullYear().toString() });
  };

  return (
    // Overlay
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-usant-red to-usant-orange p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <BookOpen size={24} />
            </div>
            <h2 className="text-xl font-bold">Add New Book</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Book Title</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Clean Architecture"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-usant-red focus:border-usant-red focus:outline-none transition-all"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Robert C. Martin"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-usant-red focus:border-usant-red focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Genre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Genre</label>
              <select 
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-usant-red focus:outline-none bg-white"
              >
                <option>Computer Science</option>
                <option>Software Engineering</option>
                <option>Fiction</option>
                <option>History</option>
                <option>Business</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
              <input 
                type="number" 
                placeholder="2024"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-usant-red focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-3 rounded-lg bg-usant-red text-white font-bold hover:bg-red-800 transition shadow-lg shadow-red-100 flex items-center justify-center gap-2"
            >
              <Check size={20} /> Save Book
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}