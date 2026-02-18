"use client";

import Navbar from '@/app/components/Navbar';
import { Book, Layers, FileText, ListPlus, Zap, BarChart3, TrendingUp, Users, ExternalLink, Plus, BookOpen, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ALL_BOOKS, MOCK_JOURNALS, MOCK_READING_LISTS, Book as BookType, Journal, ReadingList } from '@/app/lib/mockData';

export default function FacultyDashboard() {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const facultyDept = 'Computer Science'; // Simulated department

  // Filters for Faculty Specifics
  const relevantJournals = MOCK_JOURNALS.filter(j => j.subject === facultyDept);
  const readingLists = MOCK_READING_LISTS.filter(l => l.facultyId === '6'); // Assuming '6' is Dr. Robert Johnson
  const newAcquisitions = ALL_BOOKS.filter(b => b.genre === facultyDept || b.courses.includes(facultyDept))
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 4);

  // Analytics: Top engaging materials (simulated by borrow count)
  const topMaterials = [...ALL_BOOKS]
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5);

  const filteredBooks = selectedGenre === 'All' 
    ? ALL_BOOKS 
    : ALL_BOOKS.filter(book => book.genre === selectedGenre);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName="Dr. Robert Johnson" userRole="Faculty" />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-usant-red to-usant-orange text-white pt-12 pb-24 px-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Faculty Portal</h1>
              <p className="opacity-90 text-lg max-w-2xl">Manage your reading lists, explore research journals, and track student engagement with library resources.</p>
            </div>
            <div className="flex gap-3">
               <button className="px-6 py-3 bg-white text-usant-red font-bold rounded-xl shadow-lg hover:bg-gray-50 transition flex items-center gap-2">
                  <ListPlus size={20} /> Create Reading List
               </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 -mt-16 pb-12 relative z-20">
        
        {/* === ANALYTICS & QUICK STATS === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
           
           {/* Engagement Analytics Card */}
           <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                       <BarChart3 size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900">Student Engagement Trends</h3>
                 </div>
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last 30 Days</span>
              </div>
              <div className="p-6">
                 <div className="space-y-6">
                    {topMaterials.map((material, idx) => (
                       <div key={material.id} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400">
                             #{idx + 1}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between mb-1">
                                <span className="text-sm font-bold text-gray-800 truncate max-w-[200px]">{material.title}</span>
                                <span className="text-xs font-bold text-usant-red">{material.borrowCount} borrows</span>
                             </div>
                             <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-usant-red rounded-full" 
                                  style={{ width: `${(material.borrowCount / topMaterials[0].borrowCount) * 100}%` }}
                                ></div>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className="block text-xs font-bold text-gray-900">{material.views}</span>
                             <span className="text-[10px] text-gray-400 uppercase font-bold">Views</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Quick Summary Cards */}
           <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-5">
                 <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
                    <Users size={28} />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Students</p>
                    <p className="text-2xl font-black text-gray-900">124</p>
                    <p className="text-[10px] text-green-500 font-bold flex items-center gap-1 mt-1">
                       <TrendingUp size={10} /> +12% from last week
                    </p>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-5">
                 <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                    <BookOpen size={28} />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reading Lists</p>
                    <p className="text-2xl font-black text-gray-900">{readingLists.length}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">
                       Published in {facultyDept}
                    </p>
                 </div>
              </div>

              <div className="bg-usant-red p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group">
                 <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Zap size={100} />
                 </div>
                 <div className="relative z-10">
                    <h4 className="font-bold text-lg mb-1">Request Purchase</h4>
                    <p className="text-white/80 text-xs mb-4">Can't find a specific resource? Request a new acquisition for your department.</p>
                    <button className="w-full py-2 bg-white text-usant-red font-bold text-xs rounded-lg hover:bg-gray-50 transition">
                       Open Request Form
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* === JOURNALS & REFERENCES === */}
        <div className="mb-12">
           <div className="flex items-center justify-between mb-6">
              <div>
                 <h2 className="text-2xl font-bold text-gray-900">Journals & References</h2>
                 <p className="text-gray-500">Academic resources for your subject: <span className="text-usant-red font-bold">{facultyDept}</span></p>
              </div>
              <button className="text-sm font-bold text-usant-red hover:underline flex items-center gap-1">
                 View All Journals <ExternalLink size={14} />
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relevantJournals.map(journal => (
                 <div key={journal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                       <div className={`p-2 rounded-lg ${journal.type === 'Journal' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                          <FileText size={20} />
                       </div>
                       <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase tracking-tighter">Impact: {journal.impactFactor}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-usant-red transition">{journal.title}</h4>
                    <p className="text-xs text-gray-500 mb-4">{journal.publisher} • {journal.type}</p>
                    <Link href={journal.accessUrl} className="text-xs font-bold text-gray-400 group-hover:text-usant-red flex items-center gap-1 transition">
                       Access Digital Library <ExternalLink size={12} />
                    </Link>
                 </div>
              ))}
           </div>
        </div>

        {/* === NEW ACQUISITIONS === */}
        <div className="mb-12">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                 <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                    <Zap size={20} className="fill-yellow-600" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-gray-900">New Acquisitions</h2>
                    <p className="text-gray-500">Recently added materials relevant to your department</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {newAcquisitions.map(book => (
                 <div key={book.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
                    <div className="absolute top-2 left-2 z-10">
                       <span className="bg-yellow-400 text-yellow-900 text-[8px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-widest flex items-center gap-1">
                          <Clock size={8} /> New
                       </span>
                    </div>
                    <div className={`h-40 w-full ${book.color} flex items-center justify-center p-4 relative overflow-hidden`}>
                       <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className="w-20 h-28 bg-white/20 backdrop-blur-sm rounded-r-md border-l-4 border-white/30 shadow-2xl transform group-hover:-translate-y-1 transition-transform"></div>
                    </div>
                    <div className="p-4 text-center">
                       <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">{book.title}</h4>
                       <p className="text-[10px] text-gray-400 mb-3">{book.author}</p>
                       <button className="w-full py-1.5 bg-gray-50 text-gray-600 text-[10px] font-bold rounded hover:bg-red-50 hover:text-usant-red transition">
                          Add to Reading List
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* === READING LISTS === */}
        <div className="mb-12">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Reading Lists</h2>
              <button className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition flex items-center gap-2">
                 <Plus size={14} /> New List
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {readingLists.map(list => (
                 <div key={list.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-usant-red/20 transition">
                    <div className="flex items-center gap-5">
                       <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-usant-red transition">
                          <Layers size={32} />
                       </div>
                       <div>
                          <h4 className="font-bold text-gray-900 mb-1">{list.title}</h4>
                          <p className="text-xs text-gray-500">{list.bookIds.length} Materials • {list.studentCount} Students Enrolled</p>
                       </div>
                    </div>
                    <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:bg-usant-red hover:text-white transition shadow-sm">
                       <ExternalLink size={20} />
                    </button>
                 </div>
              ))}
           </div>
        </div>

        {/* Global Collection Browse (Original Section) */}
        <div className="mt-16 pt-12 border-t border-gray-200">
           <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Global Collection</h2>
              <p className="text-gray-500">Browse all available library resources</p>
           </div>
           
           <div className="flex flex-wrap gap-2 mb-8">
             {['All', ...new Set(ALL_BOOKS.map(b => b.genre))].map((genre) => (
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

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {filteredBooks.map((book) => (
               <div key={book.id} className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                 <div className={`h-48 w-full ${book.color} flex items-center justify-center p-6 relative overflow-hidden`}>
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                   <div className="w-24 h-32 bg-white/20 backdrop-blur-sm rounded-r-md border-l-4 border-white/30 shadow-2xl transform group-hover:-translate-y-1 transition-transform duration-300"></div>
                 </div>
                 
                 <div className="p-5">
                   <div className="text-xs font-semibold text-usant-red mb-1 uppercase tracking-wide">{book.genre}</div>
                   <h3 className="font-bold text-gray-900 leading-tight mb-1 truncate">{book.title}</h3>
                   <p className="text-sm text-gray-500 mb-4">{book.author}</p>
                   <button className="w-full py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg hover:bg-red-50 hover:text-usant-red transition flex items-center justify-center gap-2">
                      <Plus size={14} /> Add to List
                   </button>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </main>
    </div>
  );
}
