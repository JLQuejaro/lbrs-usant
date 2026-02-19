"use client";

import Navbar from '@/app/components/Navbar';
import { Star, Heart, ArrowLeft, Book as BookIcon, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ALL_BOOKS, getLocalWishlist, toggleLocalWishlist } from '@/app/lib/mockData';

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  
  useEffect(() => {
    setWishlistIds(getLocalWishlist());
  }, []);

  const wishlistBooks = ALL_BOOKS.filter(book => wishlistIds.includes(book.id));

  const handleRemove = (bookId: number) => {
    const newWishlist = toggleLocalWishlist(bookId);
    setWishlistIds(newWishlist);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName="John Student" userRole="Student" />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-usant-red to-usant-orange pt-12 pb-24 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center md:text-left">
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
          <h1 className="text-4xl font-bold text-white mb-2">My Wishlist</h1>
          <p className="text-white/90 text-lg">
            Books you've saved for later. We'll notify you when they become available.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 -mt-16 pb-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 min-h-[400px]">
          {wishlistBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistBooks.map(book => (
                <div key={book.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-usant-red/30 hover:shadow-md transition-all group">
                  <Link href={`/book/${book.id}`} className="flex gap-4 flex-1">
                    <div className={`w-24 h-32 ${book.color} rounded-lg shadow-md flex-shrink-0 flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10"></div>
                      <span className="text-[10px] text-white/80 font-serif text-center px-2 z-10">{book.title}</span>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="text-[10px] font-bold text-usant-red uppercase tracking-wider mb-1">{book.genre}</span>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 truncate group-hover:text-usant-red transition-colors">{book.title}</h3>
                      <p className="text-sm text-gray-500 mb-2 truncate">{book.author}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="fill-orange-400 text-orange-400" />
                          <span className="text-xs font-bold text-gray-700">{book.rating}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${book.stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {book.stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col items-center justify-center pl-4 border-l border-gray-100">
                    <button 
                      onClick={() => handleRemove(book.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Heart size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 max-w-xs mx-auto mb-8">
                Save books you're interested in and we'll keep track of them for you.
              </p>
              <Link href="/student" className="px-8 py-3 bg-usant-red text-white font-bold rounded-xl hover:bg-red-800 transition shadow-lg">
                Browse Books
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
