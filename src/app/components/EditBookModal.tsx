// src/components/EditBookModal.tsx
"use client";

import { X, BookOpen, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface EditBookFormInput {
  title: string;
  author: string;
  genre: string;
  description: string;
  pages: number | null;
  totalCopies: number;
  availableCopies: number;
  courses: string[];
}

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookId: string, book: EditBookFormInput) => Promise<void> | void;
  book: {
    id: string;
    title: string;
    author: string;
    genre: string;
    description?: string;
    pages?: number;
    stockQuantity?: number;
    availableCopies?: number;
    courses?: string[];
  } | null;
}

const AVAILABLE_COURSES = ['Computer Science', 'Information Tech', 'Engineering', 'Education', 'General'];

export default function EditBookModal({ isOpen, onClose, onSave, book }: EditBookModalProps) {
  const [formData, setFormData] = useState<EditBookFormInput>({
    title: '',
    author: '',
    genre: 'Computer Science',
    description: '',
    pages: null,
    totalCopies: 1,
    availableCopies: 1,
    courses: [],
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || 'Computer Science',
        description: book.description || '',
        pages: book.pages ?? null,
        totalCopies: book.stockQuantity ?? 1,
        availableCopies: book.availableCopies ?? 1,
        courses: book.courses || [],
      });
    }
  }, [book]);

  if (!isOpen || !book) return null;

  const handleClose = () => {
    if (isSaving) return;
    setErrorMessage(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    try {
      await onSave(book.id, {
        title: formData.title.trim(),
        author: formData.author.trim(),
        genre: formData.genre,
        description: formData.description.trim(),
        pages: formData.pages,
        totalCopies: formData.totalCopies,
        availableCopies: formData.availableCopies,
        courses: formData.courses,
      });

      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update book');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCourse = (course: string) => {
    if (formData.courses.includes(course)) {
      setFormData({ ...formData, courses: formData.courses.filter(c => c !== course) });
    } else {
      setFormData({ ...formData, courses: [...formData.courses, course] });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 scrollbar-hide">
        
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex justify-between items-center text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <BookOpen size={24} />
            </div>
            <h2 className="text-xl font-bold">Edit Book</h2>
          </div>
          <button onClick={handleClose} className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Book Title</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Clean Architecture"
              value={formData.title}
              disabled={isSaving}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Robert C. Martin"
              value={formData.author}
              disabled={isSaving}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Genre</label>
              <select 
                value={formData.genre}
                disabled={isSaving}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              >
                <option>Computer Science</option>
                <option>Software Engineering</option>
                <option>Fiction</option>
                <option>History</option>
                <option>Business</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pages</label>
              <input 
                type="number" 
                placeholder="e.g. 350"
                value={formData.pages ?? ''}
                disabled={isSaving}
                onChange={(e) => setFormData({...formData, pages: e.target.value ? Number(e.target.value) : null})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea 
              placeholder="Brief description of the book..."
              value={formData.description}
              disabled={isSaving}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Total Copies</label>
              <input 
                required
                type="number" 
                min="1"
                value={formData.totalCopies}
                disabled={isSaving}
                onChange={(e) => setFormData({...formData, totalCopies: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Available Copies</label>
              <input 
                required
                type="number" 
                min="0"
                max={formData.totalCopies}
                value={formData.availableCopies}
                disabled={isSaving}
                onChange={(e) => setFormData({...formData, availableCopies: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Applicable Courses</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_COURSES.map(course => (
                <label key={course} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input 
                    type="checkbox" 
                    checked={formData.courses.includes(course)}
                    disabled={isSaving}
                    onChange={() => toggleCourse(course)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-600 border-gray-300"
                  />
                  <span className="text-sm text-gray-600">{course}</span>
                </label>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              <Check size={20} /> {isSaving ? 'Saving...' : 'Update Book'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
