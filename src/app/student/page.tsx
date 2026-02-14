"use client";

import Navbar from '@/app/components/Navbar';
import { Book, Layers, Search, Clock, Star, SlidersHorizontal, RotateCcw, X, History } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock Data
const ALL_BOOKS = [
  { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', genre: 'Computer Science', color: 'bg-red-900', rating: 4.8, year: 2009, stock: true },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Software Engineering', color: 'bg-blue-800', rating: 4.9, year: 2008, stock: true },
  { id: 3, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Software Engineering', color: 'bg-slate-700', rating: 4.7, year: 1999, stock: false },
  { id: 4, title: 'Design Patterns', author: 'Erich Gamma', genre: 'Computer Science', color: 'bg-emerald-800', rating: 4.6, year: 1994, stock: true },
  { id: 5, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', color: 'bg-amber-700', rating: 4.9, year: 1960, stock: true },
  { id: 6, title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', color: 'bg-orange-800', rating: 4.5, year: 2011, stock: true },
  { id: 7, title: 'The Psychology of Money', author: 'Morgan Housel', genre: 'Finance', color: 'bg-green-700', rating: 4.8, year: 2020, stock: true },
  { id: 8, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', color: 'bg-yellow-600', rating: 4.9, year: 2018, stock: true },
];

const GENRES = ['All', 'Computer Science', 'Software Engineering', 'Fiction', 'History', 'Finance', 'Self-Help'];

export default function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true); // Default to TRUE to show it immediately
  
  // Recent Search State
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  // Filter Values
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [maxYear, setMaxYear] = useState(2026);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Relevance');

  // Load Recent Searches on Mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const addToRecent = (term: string) => {
    if (!term.trim()) return;
    const newRecent = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
  };

  const removeRecent = (term: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking the item
    const newRecent = recentSearches.filter(t => t !== term);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
  };

  const handleSearchSelect = (term: string) => {
    setSearchTerm(term);
    addToRecent(term);
    setShowRecent(false);
  };

  // Filter Logic
  const filteredBooks = ALL_BOOKS.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    const matchesRating = book.rating >= minRating;
    const matchesYear = book.year <= maxYear;
    const matchesStock = inStockOnly ? book.stock : true;

    return matchesSearch && matchesGenre && matchesRating && matchesYear && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'Rating') return b.rating - a.rating;
    if (sortBy === 'Newest') return b.year - a.year;
    if (sortBy === 'Oldest') return a.year - b.year;
    if (sortBy === 'Title') return a.title.localeCompare(b.title);
    return 0;
  });

  const clearFilters = () => {
    setSelectedGenre('All');
    setMinRating(0);
    setMaxYear(2026);
    setInStockOnly(false);
    setSortBy('Relevance');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName="John Student" userRole="Student" />

      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-usant-red to-usant-orange pt-12 pb-24 px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto z-10 text-center md:text-left">
          <h1 className="text-4xl font-bold text-white mb-2 text-shadow-sm">Library Collection</h1>
          <p className="text-white/90 text-lg max-w-2xl">
            Explore vast resources tailored for your academic success.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 -mt-16 pb-12 relative z-20">
        
        {/* === SEARCH & FILTER PANEL (Matches Screenshot) === */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">Search Books</h2>
              <p className="text-gray-500">Find your next favorite book from our collection</p>
          </div>

          {/* Search Bar Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 bg-gray-50 rounded-lg group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
               <input 
                  type="text" 
                  placeholder="Search by title, author, or genre..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowRecent(true)}
                  onBlur={() => setTimeout(() => setShowRecent(false), 200)}
                  onKeyDown={(e) => e.key === 'Enter' && addToRecent(searchTerm)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-usant-red/20 focus:border-usant-red transition-all"
               />

               {/* RECENTLY SEARCHED DROPDOWN */}
               {showRecent && recentSearches.length > 0 && (
                 <div className="absolute top-full left-0 right-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 ring-1 ring-black/5 animate-in slide-in-from-top-1 fade-in duration-200">
                   <div className="flex items-center justify-between px-5 py-3 bg-gray-50/80 backdrop-blur-sm border-b border-gray-100">
                     <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <History size={12} /> Recent History
                     </span>
                     <button 
                       onMouseDown={(e) => { e.preventDefault(); setRecentSearches([]); localStorage.removeItem('recentSearches'); }} 
                       className="text-[10px] text-gray-400 hover:text-red-600 font-bold hover:underline transition-colors"
                     >
                       Clear History
                     </button>
                   </div>
                   <ul className="max-h-64 overflow-y-auto">
                     {recentSearches.map((term, index) => (
                       <li key={index} className="border-b border-gray-50 last:border-0">
                         <button 
                           onMouseDown={(e) => { e.preventDefault(); handleSearchSelect(term); }}
                           className="w-full text-left px-5 py-3.5 hover:bg-red-50/30 flex items-center justify-between group/item transition-all duration-200"
                         >
                           <div className="flex items-center gap-4 text-gray-600 group-hover/item:text-gray-900 group-hover/item:translate-x-1 transition-transform">
                             <div className="p-1.5 bg-gray-100 rounded-md group-hover/item:bg-white group-hover/item:shadow-sm transition-all">
                                <Clock size={14} className="text-gray-400 group-hover/item:text-usant-red transition-colors" />
                             </div>
                             <span className="font-medium text-sm">{term}</span>
                           </div>
                           <div 
                             onMouseDown={(e) => removeRecent(term, e)}
                             className="p-1.5 rounded-full hover:bg-red-100 text-gray-300 hover:text-red-600 transition-all opacity-0 group-hover/item:opacity-100 scale-90 hover:scale-100"
                           >
                             <X size={14} />
                           </div>
                         </button>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg font-bold border transition-all flex items-center gap-2 whitespace-nowrap ${
                showFilters 
                ? 'bg-white text-usant-red border-usant-red hover:bg-red-50' 
                : 'bg-usant-red text-white border-usant-red hover:bg-red-800'
              }`}
            >
              <SlidersHorizontal size={18} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilters && (
            <div className="border border-gray-200 rounded-xl p-6 bg-white animate-in slide-in-from-top-2 duration-300">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Filters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1: Dropdowns */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Genre</label>
                    <select 
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-usant-red focus:ring-1 focus:ring-usant-red"
                    >
                      {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Sort By</label>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-usant-red focus:ring-1 focus:ring-usant-red"
                    >
                      <option value="Relevance">Relevance</option>
                      <option value="Title">Title (A-Z)</option>
                      <option value="Rating">Rating (High to Low)</option>
                      <option value="Newest">Newest First</option>
                      <option value="Oldest">Oldest First</option>
                    </select>
                  </div>
                </div>

                {/* Column 2: Sliders */}
                <div className="space-y-8">
                   {/* Rating Slider (Yellow) */}
                   <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Min. Rating: {minRating}</label>
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      </div>
                      <input 
                        type="range" 
                        min="0" max="5" step="0.5" 
                        value={minRating}
                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                      />
                   </div>
                   
                   {/* Year Slider (Red/Gray - replacing Price from screenshot for library context) */}
                   <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Max Year: {maxYear}</label>
                      </div>
                      <input 
                        type="range" 
                        min="1950" max="2026" 
                        value={maxYear}
                        onChange={(e) => setMaxYear(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-usant-red"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>1950</span>
                        <span>2026</span>
                      </div>
                   </div>
                </div>

                {/* Column 3: Checkbox & Clear */}
                <div className="flex flex-col justify-end pb-2 gap-4">
                   <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="stock"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-5 h-5 rounded text-usant-red focus:ring-usant-red border-gray-300 cursor-pointer"
                      />
                      <label htmlFor="stock" className="text-sm font-medium text-gray-700 cursor-pointer select-none">Show in-stock only</label>
                   </div>

                   <button 
                    onClick={clearFilters}
                    className="w-full py-3 border border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 mt-4"
                   >
                     Clear All
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 mb-6">
           <h2 className="text-xl font-bold text-gray-900">
             {filteredBooks.length} Books Found
           </h2>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBooks.map((book) => (
            <Link 
              href={`/book/${book.id}`} 
              key={book.id} 
              className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full ${!book.stock ? 'opacity-60 grayscale' : ''}`}
            >
              <div className={`h-56 w-full ${book.color} flex items-center justify-center p-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent group-hover:opacity-50 transition-opacity" />
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/20 blur-sm"></div>
                <div className="relative w-28 h-40 bg-white/10 backdrop-blur-md rounded-r-md border-l-2 border-white/20 shadow-2xl flex flex-col items-center justify-center text-center p-2 transform group-hover:scale-105 transition-transform duration-300">
                    <span className="text-[10px] text-white/80 uppercase tracking-widest mb-1">{book.genre.substring(0, 3)}</span>
                    <div className="w-full h-px bg-white/30 mb-2"></div>
                    <span className="text-white font-serif text-sm leading-tight line-clamp-3">{book.title}</span>
                </div>
                {!book.stock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider -rotate-12 border-2 border-white">Out of Stock</span>
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-orange-400 text-orange-400" />
                    <span className="text-xs font-bold text-gray-700">{book.rating}</span>
                  </div>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{book.year}</span>
                </div>
                
                <h3 className="font-bold text-gray-900 leading-tight mb-1 text-lg group-hover:text-usant-red transition-colors">{book.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{book.author}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                   <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">{book.genre}</span>
                   <span className="text-xs font-bold text-usant-red group-hover:underline">View Details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No books found</h3>
            <button onClick={clearFilters} className="mt-6 px-6 py-2 bg-usant-red text-white font-medium rounded-lg hover:bg-red-800 transition">
              Clear All Filters
            </button>
          </div>
        )}

      </main>
    </div>
  );
}