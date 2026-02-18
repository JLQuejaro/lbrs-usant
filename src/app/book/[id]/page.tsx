// src/app/book/[id]/page.tsx
"use client";

import Navbar from '@/app/components/Navbar';
import BorrowModal from '@/app/components/BorrowModal'; // IMPORT THE MODAL
import { Star, Clock, BookOpen, Calendar, ArrowLeft, Heart, Share2, MessageSquare, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react'; // IMPORT STATE
import { ALL_BOOKS, getReviewsByBookId, Book, Review } from '@/app/lib/mockData';

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const bookId = parseInt(params.id);
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false); // STATE FOR MODAL

  useEffect(() => {
    const foundBook = ALL_BOOKS.find(b => b.id === bookId);
    if (foundBook) {
      setBook(foundBook);
      setReviews(getReviewsByBookId(bookId));
    }
  }, [bookId]);

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar userName="John Student" userRole="Student" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
             <Link href="/student" className="text-usant-red hover:underline font-bold">Back to Browse</Link>
          </div>
        </div>
      </div>
    );
  }

  const relatedBooks = ALL_BOOKS.filter(b => b.genre === book.genre && b.id !== book.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName="John Student" userRole="Student" />

      {/* MODAL COMPONENT */}
      <BorrowModal 
        isOpen={isBorrowModalOpen} 
        onClose={() => setIsBorrowModalOpen(false)} 
        bookTitle={book.title} 
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
            <div className={`aspect-[2/3] w-full ${book.color} rounded-xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 text-center mb-6`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent"></div>
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/20 blur-sm"></div>
              
              <div className="relative z-10 border-4 border-white/20 p-4 w-full h-full flex flex-col justify-center backdrop-blur-sm rounded">
                <h1 className="text-white font-serif text-2xl font-bold leading-tight mb-2">{book.title}</h1>
                <p className="text-white/80 text-sm">{book.author}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
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

          {/* RIGHT: Details & Recommendations */}
          <div className="md:col-span-8 lg:col-span-9">
             <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                 <span className="px-3 py-1 bg-red-50 text-usant-red text-xs font-bold uppercase tracking-wider rounded-full">{book.genre}</span>
                 <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1 ${book.stock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                   <span className={`w-2 h-2 rounded-full ${book.stock ? 'bg-green-500' : 'bg-red-500'}`}></span> {book.stock ? 'Available' : 'Out of Stock'}
                 </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-500">by <span className="text-gray-900 font-medium">{book.author}</span></p>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 py-6 border-y border-gray-100 mb-8">
               <div className="flex items-center gap-3">
                  <Star className="text-orange-400 fill-orange-400" size={24} />
                  <div>
                    <div className="text-lg font-bold text-gray-900">{book.rating}</div>
                    <div className="text-xs text-gray-500">{book.reviewCount || 0} reviews</div>
                  </div>
               </div>
               <div className="w-px h-10 bg-gray-200"></div>
               <div className="flex items-center gap-3">
                  <BookOpen className="text-gray-400" size={24} />
                  <div>
                    <div className="text-lg font-bold text-gray-900">{book.pages || '---'}</div>
                    <div className="text-xs text-gray-500">Pages</div>
                  </div>
               </div>
               <div className="w-px h-10 bg-gray-200"></div>
               <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={24} />
                  <div>
                    <div className="text-lg font-bold text-gray-900">{book.year}</div>
                    <div className="text-xs text-gray-500">Year</div>
                  </div>
               </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-shadow-sm">Synopsis</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {book.description || "No description available for this book."}
              </p>
            </div>

            {/* Peer Reviews Section */}
            <div className="mb-12">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <MessageSquare size={20} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900">Peer Reviews</h3>
               </div>
               
               <div className="space-y-4">
                  {reviews.length > 0 ? reviews.map(review => (
                     <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                 <UserIcon size={20} />
                              </div>
                              <div>
                                 <p className="font-bold text-gray-900 text-sm">{review.userName}</p>
                                 <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{new Date(review.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                              <Star size={14} className="fill-orange-400 text-orange-400" />
                              <span className="text-sm font-bold text-orange-700">{review.rating}</span>
                           </div>
                        </div>
                        <p className="text-gray-600 text-sm italic leading-relaxed">
                           "{review.comment}"
                        </p>
                     </div>
                  )) : (
                     <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm">No peer reviews yet. Be the first to review!</p>
                     </div>
                  )}
               </div>
            </div>

            {/* Related Books Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-gradient-to-br from-usant-red to-usant-orange rounded-lg text-white">
                   <Clock size={20} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900">Because you viewed this book</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedBooks.map((b) => (
                   <Link href={`/book/${b.id}`} key={b.id} className="group block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer">
                      <div className={`h-32 w-full ${b.color} rounded-lg mb-3 flex items-center justify-center p-2 text-center overflow-hidden relative`}>
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                         <span className="text-white text-xs font-serif leading-tight relative z-10">{b.title}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-usant-red transition">{b.title}</h4>
                      <p className="text-xs text-gray-500">{b.author}</p>
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