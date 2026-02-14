// src/app/librarian/page.tsx
"use client";

import Navbar from '@/app/components/Navbar';
import AddBookModal from '@/app/components/AddBookModal'; // Import the new modal
import { Book, Users, Layers, Plus, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

// Initial Mock Data
const INITIAL_BOOKS = [
  { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', genre: 'Computer Science', year: 2009, stock: true, courses: ['Computer Science'] },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Software Engineering', year: 2008, stock: true, courses: ['Computer Science', 'Information Tech'] },
  { id: 3, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Software Engineering', year: 1999, stock: false, courses: ['Computer Science', 'Information Tech'] },
  { id: 4, title: 'Design Patterns', author: 'Erich Gamma', genre: 'Computer Science', year: 1994, stock: true, courses: ['Computer Science'] },
];

export default function LibrarianDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [books, setBooks] = useState(INITIAL_BOOKS);     // State for book list

  // Function to handle adding a new book
  const handleAddBook = (newBook: any) => {
    setBooks([newBook, ...books]); // Add new book to the TOP of the list
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName="Maria Santos" userRole="Librarian" />
      
      {/* The Modal Component */}
      <AddBookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddBook} 
      />

      <main className="max-w-7xl mx-auto px-8 py-10">
        
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Librarian Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage books and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Book size={32} className="text-usant-red" />} label="Total Books" value={books.length.toString()} />
          <StatCard icon={<Users size={32} className="text-orange-500" />} label="Active Users" value="7" />
          <StatCard icon={<Layers size={32} className="text-usant-red" />} label="Genres" value="5" />
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search books..." 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-usant-red shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* The Button now opens the modal */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="ml-4 bg-gradient-to-r from-usant-red to-usant-orange hover:shadow-lg hover:shadow-orange-200 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
                <Plus size={20} /> Add Book
            </button>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-usant-red text-white">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-90">Book</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-90">Author</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-90">Genre</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-90">Stock</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-90">Courses</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right opacity-90">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-red-50/30 transition group">
                  <td className="px-6 py-4 font-semibold text-gray-900">{book.title}</td>
                  <td className="px-6 py-4 text-gray-600">{book.author}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border 
                      ${book.genre === 'Computer Science' ? 'bg-red-50 text-red-700 border-red-100' : 
                        book.genre === 'Software Engineering' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-orange-50 text-orange-700 border-orange-100'}`}>
                      {book.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {book.stock ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-100 w-fit">
                        <CheckCircle size={12} /> In Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md border border-red-100 w-fit">
                        <XCircle size={12} /> Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {book.courses?.slice(0, 2).map((course: string) => (
                         <span key={course} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                           {course}
                         </span>
                      ))}
                      {book.courses?.length > 2 && (
                        <span className="text-[10px] text-gray-400 font-medium">+{book.courses.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button className="text-usant-red hover:bg-red-50 p-2 rounded-lg transition"><Edit size={16} /></button>
                      <button className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State if search finds nothing */}
          {filteredBooks.length === 0 && (
            <div className="p-8 text-center text-gray-500">
                No books found. Try adding one!
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-40 hover:shadow-md transition-all">
      <div className="mb-4">{icon}</div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}