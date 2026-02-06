"use client";

import Navbar from '@/app/components/Navbar';
import { Book, Layers } from 'lucide-react';
import { useState } from 'react';

// Mock Data
const ALL_BOOKS = [
  { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', genre: 'Computer Science', color: 'bg-red-900' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Software Engineering', color: 'bg-blue-800' },
  { id: 3, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Software Engineering', color: 'bg-slate-700' },
  { id: 4, title: 'Design Patterns', author: 'Erich Gamma', genre: 'Computer Science', color: 'bg-emerald-800' },
  { id: 5, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', color: 'bg-amber-700' },
  { id: 6, title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', color: 'bg-orange-800' },
];

const GENRES = ['All', 'Computer Science', 'Software Engineering', 'Fiction', 'History', 'Psychology', 'Philosophy', 'Science', 'Business'];

export default function FacultyDashboard() {
  const [selectedGenre, setSelectedGenre] = useState('All');

  const filteredBooks = selectedGenre === 'All' 
    ? ALL_BOOKS 
    : ALL_BOOKS.filter(book => book.genre === selectedGenre);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with Faculty Context */}
      <Navbar userName="Dr. Robert Johnson" userRole="Faculty" />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-usant-red to-usant-orange text-white pt-12 pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Welcome back, Dr.!</h1>
          <p className="opacity-90 text-lg">Discover your next favorite book from our personalized recommendations</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 -mt-16 pb-12">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="block text-4xl font-bold text-usant-red mb-1">12</span>
              <span className="text-gray-500">Books Available</span>
            </div>
            <div className="bg-red-50 p-4 rounded-full text-usant-red opacity-20">
               <Book size={40} /> 
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="block text-4xl font-bold text-orange-500 mb-1">9</span>
              <span className="text-gray-500">Genres</span>
            </div>
            <div className="bg-orange-50 p-4 rounded-full text-orange-500 opacity-20">
               <Layers size={40} /> 
            </div>
          </div>
        </div>

        {/* Browse Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Browse Books</h2>
          <p className="text-gray-500">Explore our collection by genre</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedGenre === genre
                  ? 'bg-usant-red text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className={`h-48 w-full ${book.color} flex items-center justify-center p-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="w-24 h-32 bg-white/20 backdrop-blur-sm rounded-r-md border-l-4 border-white/30 shadow-2xl transform group-hover:-translate-y-1 transition-transform duration-300"></div>
              </div>
              
              <div className="p-5">
                <div className="text-xs font-semibold text-usant-red mb-1 uppercase tracking-wide">{book.genre}</div>
                <h3 className="font-bold text-gray-900 leading-tight mb-1">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}