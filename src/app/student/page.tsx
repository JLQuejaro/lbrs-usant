"use client";

import Navbar from '@/app/components/Navbar';
import { Book, Layers, Search, Clock, SlidersHorizontal, RotateCcw, X, History, Sparkles, ChevronDown, Users, Heart, Bell, Library, ShieldCheck, MapPin, GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ALL_BOOKS, getCollaborativeRecommendations, getLocalWishlist, toggleLocalWishlist, MOCK_NOTIFICATIONS, getLocalBorrows } from '@/app/lib/mockData';

const GENRES = ['All', 'Computer Science', 'Software Engineering', 'Fiction', 'History', 'Finance', 'Self-Help', 'Engineering', 'Education', 'Psychology'];
const COURSES = [
  // College of Information and Business Management
  'Business Administration',
  'Hospitality Management',
  'Tourism Management',
  'Computer Science',
  'Library and Information Science',
  'Office Administration',
  // College of Accountancy
  'Accountancy',
  'Accounting Information System',
  'Internal Auditing',
  'Management Accounting',
  // College of Engineering and Architecture
  'Architecture',
  'Civil Engineering',
  // College of Maritime Education
  'Marine Transportation',
  'Marine Engineering',
  // College of Criminal Justice Education
  'Criminology',
  // College of Health Care Education
  'Nursing',
  // College of Liberal Arts
  'Psychology',
  'Communication',
  'English Language',
  'Political Science',
  // College of Teacher Education
  'Elementary Education',
  'Secondary Education',
  'Technology and Livelihood Education',
  'Early Childhood Education',
  'Physical Education',
  'Special Needs Education',
];

export default function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  
  // Wishlist & Notification Stats
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [borrowCount, setBorrowCount] = useState(0);

  // Recent Search State
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  // User Course State (For Recommendations)
  const [userCourse, setUserCourse] = useState('Computer Science');

  // Collaborative Recommendations
  const [collabBooks, setCollabBooks] = useState(getCollaborativeRecommendations('1', 4, userCourse));

  // Filter Values
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [maxYear, setMaxYear] = useState(2026);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Relevance');

  // Update collaborative recommendations when course changes
  useEffect(() => {
     setCollabBooks(getCollaborativeRecommendations('1', 4, userCourse));
  }, [userCourse]);

  // Load Initial Data on Mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    setWishlist(getLocalWishlist());
    setUnreadCount(MOCK_NOTIFICATIONS.filter(n => !n.read).length);
    setBorrowCount(getLocalBorrows().length);
  }, []);

  const handleToggleWishlist = (e: React.MouseEvent, bookId: number) => {
    e.preventDefault();
    e.stopPropagation();
    const newWishlist = toggleLocalWishlist(bookId);
    setWishlist(newWishlist);
  };

  const addToRecent = (term: string) => {
    if (!term.trim()) return;
    const newRecent = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
  };

  const removeRecent = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
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
    const matchesYear = book.year <= maxYear;
    const matchesStock = inStockOnly ? book.stock : true;

    return matchesSearch && matchesGenre && matchesYear && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'Newest') return b.year - a.year;
    if (sortBy === 'Oldest') return a.year - b.year;
    if (sortBy === 'Title') return a.title.localeCompare(b.title);
    return 0;
  });

  const clearFilters = () => {
    setSelectedGenre('All');
    setMaxYear(2026);
    setInStockOnly(false);
    setSortBy('Relevance');
    setSearchTerm('');
  };

  // Recommendations Logic
  const recommendedBooks = ALL_BOOKS.filter(book => book.courses?.includes(userCourse)).slice(0, 4);

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
        
        {/* === QUICK ACCESS OVERVIEW === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
           <Link href="/student/wishlist-page" className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 hover:border-usant-red/30 transition-all group">
              <div className="p-3 bg-red-50 rounded-xl text-usant-red group-hover:bg-usant-red group-hover:text-white transition-colors">
                 <Heart size={24} className={wishlist.length > 0 ? 'fill-current' : ''} />
              </div>
              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">My Wishlist</p>
                 <p className="text-2xl font-black text-gray-900">{wishlist.length} <span className="text-sm font-medium text-gray-500">Books Saved</span></p>
              </div>
           </Link>

           <Link href="/student/notifications-page" className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 hover:border-usant-red/30 transition-all group">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors relative">
                 <Bell size={24} />
                 {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>}
              </div>
              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notifications</p>
                 <p className="text-2xl font-black text-gray-900">{unreadCount} <span className="text-sm font-medium text-gray-500">Unread Alerts</span></p>
              </div>
           </Link>

           <Link href="/student/shelf" className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 hover:border-usant-red/30 transition-all group">
              <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                 <Library size={24} />
              </div>
              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">My Shelf</p>
                 <p className="text-2xl font-black text-gray-900">{borrowCount} <span className="text-sm font-medium text-gray-500">Active Borrows</span></p>
              </div>
           </Link>
        </div>
        
        {/* === RECOMMENDED SECTION === */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                    <Sparkles size={20} className="fill-yellow-600" />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-none">Recommended for You</h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">Based on your course: <span className="text-usant-red">{userCourse}</span></p>
                 </div>
              </div>
              
              {/* Course Switcher (Demo Only) */}
              <div className="relative group">
                 <button className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                    Switch Course <ChevronDown size={12} />
                 </button>
                 <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="max-h-64 overflow-y-auto">
                    {COURSES.map(course => (
                       <button
                         key={course}
                         onClick={() => setUserCourse(course)}
                         className={`w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-usant-red transition ${userCourse === course ? 'font-bold text-usant-red bg-red-50' : 'text-gray-600'}`}
                       >
                         {course}
                       </button>
                    ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedBooks.map(book => (
                 <Link href={`/book/${book.id}`} key={book.id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group cursor-pointer relative">
                    <div className={`w-16 h-20 ${book.color} rounded-md shadow-md flex-shrink-0 flex items-center justify-center`}>
                       <span className="text-[8px] text-white/80 font-serif text-center px-1">{book.title.substring(0, 15)}...</span>
                    </div>
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                       <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-usant-red transition-colors">{book.title}</h4>
                       <p className="text-xs text-gray-500 mb-1 truncate">{book.author}</p>
                    </div>
                    <button
                       onClick={(e) => handleToggleWishlist(e, book.id)}
                       className={`p-1.5 rounded-full hover:bg-white shadow-sm transition-all ${wishlist.includes(book.id) ? 'text-red-500' : 'text-gray-300'}`}
                    >
                       <Heart size={14} className={wishlist.includes(book.id) ? 'fill-current' : ''} />
                    </button>
                 </Link>
              ))}
           </div>
        </div>

        {/* === COLLABORATIVE FILTERING SECTION === */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Users size={20} className="fill-blue-600" />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-none">Students like you also read</h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">Trending among <span className="text-blue-600">{userCourse}</span> students</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {collabBooks.length > 0 ? collabBooks.map(book => (
                 <Link href={`/book/${book.id}`} key={book.id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group cursor-pointer relative">
                    <div className={`w-16 h-20 ${book.color} rounded-md shadow-md flex-shrink-0 flex items-center justify-center`}>
                       <span className="text-[8px] text-white/80 font-serif text-center px-1">{book.title.substring(0, 15)}...</span>
                    </div>
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                       <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">{book.title}</h4>
                       <p className="text-xs text-gray-500 mb-1 truncate">{book.author}</p>
                    </div>
                    <button
                       onClick={(e) => handleToggleWishlist(e, book.id)}
                       className={`p-1.5 rounded-full hover:bg-white shadow-sm transition-all ${wishlist.includes(book.id) ? 'text-red-500' : 'text-gray-300'}`}
                    >
                       <Heart size={14} className={wishlist.includes(book.id) ? 'fill-current' : ''} />
                    </button>
                 </Link>
              )) : (
                 <div className="col-span-4 py-8 text-center text-gray-400 italic text-sm">
                    No peer activity found for this course yet.
                 </div>
              )}
           </div>
        </div>

        {/* === SEARCH & FILTER PANEL === */}
        <div id="browse" className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
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
                      <option value="Newest">Newest First</option>
                      <option value="Oldest">Oldest First</option>
                    </select>
                  </div>
                </div>

                {/* Column 2: Sliders */}
                <div className="space-y-8">
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

        {/* === BOOK GRID WITH NEW DETAILS === */}
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
                
                <h3 className="font-bold text-gray-900 leading-tight mb-1 text-lg group-hover:text-usant-red transition-colors line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-500 mb-3 truncate">{book.author}</p>
                
                {/* NEW: Extra Details (Location & Course Tag) */}
                <div className="flex flex-col gap-1.5 mb-4 mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate">{book.location || 'Main Library - General'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <GraduationCap size={14} className="text-gray-400" />
                    <span className="truncate">{book.courses && book.courses.length > 0 ? book.courses.join(', ') : 'All Courses'}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600 truncate max-w-[80px]">{book.genre}</span>
                      <button 
                         onClick={(e) => handleToggleWishlist(e, book.id)}
                         className={`p-2 rounded-full hover:bg-gray-50 transition-all ${wishlist.includes(book.id) ? 'text-red-500' : 'text-gray-400'}`}
                      >
                         <Heart size={18} className={wishlist.includes(book.id) ? 'fill-current' : ''} />
                      </button>
                   </div>
                   <span className="text-xs font-bold text-usant-red group-hover:underline whitespace-nowrap">View Details</span>
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
          
        {/* Privacy & Security Note */}
        <div className="mt-16 flex items-center justify-center gap-2 text-gray-400">
           <ShieldCheck size={16} />
           <p className="text-xs font-medium">Your reading history and personal data are private and secure.</p>
        </div>
  
      </main>
    </div>
  );
}