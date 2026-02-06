// src/app/book/[id]/page.tsx
"use client";

import Navbar from '@/app/components/Navbar';
import BorrowModal from '@/app/components/BorrowModal'; // IMPORT THE MODAL
import { Star, Clock, BookOpen, Calendar, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react'; // IMPORT STATE

// ... (Keep your BOOK_DETAILS and RELATED_BOOKS constants exactly the same) ...
const BOOK_DETAILS = {
  id: 1,
  title: 'Introduction to Algorithms',
  author: 'Thomas H. Cormen',
  genre: 'Computer Science',
  rating: 4.8,
  reviews: 124,
  pages: 1312,
  language: 'English',
  year: 2009,
  status: 'Available',
  description: "This title covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers. Each chapter is relatively self-contained and can be used as a unit of study. The algorithms are described in English and in a pseudocode designed to be readable by anyone who has done a little programming.",
  coverColor: 'bg-red-900', 
};

const RELATED_BOOKS = [
  { id: 4, title: 'Design Patterns', author: 'Erich Gamma', color: 'bg-emerald-800' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', color: 'bg-blue-800' },
  { id: 9, title: 'Refactoring', author: 'Martin Fowler', color: 'bg-indigo-900' },
];

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false); // STATE FOR MODAL

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName="John Student" userRole="Student" />

      {/* MODAL COMPONENT */}
      <BorrowModal 
        isOpen={isBorrowModalOpen} 
        onClose={() => setIsBorrowModalOpen(false)} 
        bookTitle={BOOK_DETAILS.title} 
      />

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-500 hover:text-usant-red transition mb-8 font-medium"
        >
          <ArrowLeft size={20} /> Back to Browse
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* LEFT: Book Cover & Actions */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className={`aspect-[2/3] w-full ${BOOK_DETAILS.coverColor} rounded-xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 text-center mb-6`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent"></div>
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/20 blur-sm"></div>
              
              <div className="relative z-10 border-4 border-white/20 p-4 w-full h-full flex flex-col justify-center backdrop-blur-sm rounded">
                <h1 className="text-white font-serif text-2xl font-bold leading-tight mb-2">{BOOK_DETAILS.title}</h1>
                <p className="text-white/80 text-sm">{BOOK_DETAILS.author}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* CONNECTED BUTTON */}
              <button 
                onClick={() => setIsBorrowModalOpen(true)}
                className="w-full bg-usant-red hover:bg-red-800 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-100 transition flex items-center justify-center gap-2 transform active:scale-95 duration-100"
              >
                <BookOpen size={20} /> Borrow Now
              </button>

              <div className="grid grid-cols-2 gap-3">
                 <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition">
                   <Heart size={18} /> Wishlist
                 </button>
                 <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition">
                   <Share2 size={18} /> Share
                 </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Details & Recommendations (Same as before) */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* ... (Keep the rest of the right column exactly the same as previous code) ... */}
             <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                 <span className="px-3 py-1 bg-red-50 text-usant-red text-xs font-bold uppercase tracking-wider rounded-full">{BOOK_DETAILS.genre}</span>
                 <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full bg-green-500"></span> {BOOK_DETAILS.status}
                 </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{BOOK_DETAILS.title}</h1>
              <p className="text-xl text-gray-500">by <span className="text-gray-900 font-medium">{BOOK_DETAILS.author}</span></p>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 py-6 border-y border-gray-100 mb-8">
               <div className="flex items-center gap-3">
                  <Star className="text-orange-400 fill-orange-400" size={24} />
                  <div>
                    <div className="text-lg font-bold text-gray-900">{BOOK_DETAILS.rating}</div>
                    <div className="text-xs text-gray-500">{BOOK_DETAILS.reviews} reviews</div>
                  </div>
               </div>
               <div className="w-px h-10 bg-gray-200"></div>
               <div className="flex items-center gap-3">
                  <BookOpen className="text-gray-400" size={24} />
                  <div>
                    <div className="text-lg font-bold text-gray-900">{BOOK_DETAILS.pages}</div>
                    <div className="text-xs text-gray-500">Pages</div>
                  </div>
               </div>
               <div className="w-px h-10 bg-gray-200"></div>
               <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={24} />
                  <div>
                    <div className="text-lg font-bold text-gray-900">{BOOK_DETAILS.year}</div>
                    <div className="text-xs text-gray-500">Year</div>
                  </div>
               </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Synopsis</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {BOOK_DETAILS.description}
              </p>
            </div>

            {/* AI Recommendations Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-gradient-to-br from-usant-red to-usant-orange rounded-lg text-white">
                   <Clock size={20} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900">Because you viewed this book</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {RELATED_BOOKS.map((book) => (
                   <Link href={`/book/${book.id}`} key={book.id} className="group block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer">
                      <div className={`h-32 w-full ${book.color} rounded-lg mb-3 flex items-center justify-center p-2 text-center overflow-hidden relative`}>
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                         <span className="text-white text-xs font-serif leading-tight relative z-10">{book.title}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-usant-red transition">{book.title}</h4>
                      <p className="text-xs text-gray-500">{book.author}</p>
                   </Link>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}