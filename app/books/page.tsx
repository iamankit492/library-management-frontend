'use client';
import { useEffect, useState } from 'react';
import { booksAPI } from '@/lib/api';
import { Plus } from 'lucide-react';

/**
 * Books Page - View and Manage All Books
 * 
 * Main books inventory page showing all books in the library.
 * 
 * Features:
 * - View all books or filter to show only available books
 * - Book cards with title, author, availability status
 * - Quick link to add new books
 * - Toggle between "All Books" and "Available Only"
 * 
 * Data Flow:
 * 1. On page load, fetch all books
 * 2. When filter changes, fetch appropriate data
 * 3. Display books in responsive grid
 * 
 * Links To:
 * - booksAPI.getAll() - for "All Books" view
 * - booksAPI.getAvailable() - for "Available Only" view
 * - /books/add - page to add new books
 */

// TypeScript interface for Book data
interface Book {
  id: number;
  title: string;
  author: string;
  availableQuantity: number;
  totalQuantity: number;
  isbn?: string;
  category?: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState('all'); // 'all' or 'available'
  const [loading, setLoading] = useState(true);

  // Fetch books based on selected filter
  useEffect(() => {
    setLoading(true);
    
    if (filter === 'available') {
      booksAPI.getAvailable()
        .then(res => {
          setBooks(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading available books:', err);
          setLoading(false);
        });
    } else {
      booksAPI.getAll()
        .then(res => {
          setBooks(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading all books:', err);
          setLoading(false);
        });
    }
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Page Header with Filter Buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Books Inventory</h1>
        
        {/* Filter and Action Buttons */}
        <div className="flex gap-4">
          {/* All Books Filter Button */}
          <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-2 rounded transition ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            All Books
          </button>
          
          {/* Available Only Filter Button */}
          <button 
            onClick={() => setFilter('available')} 
            className={`px-4 py-2 rounded transition ${
              filter === 'available' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Available Only
          </button>
          
          {/* Add Book Button */}
          <a 
            href="/books/add" 
            className="bg-primary text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" /> Add Book
          </a>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Loading books...</p>
        </div>
      )}

      {/* Books Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <div 
              key={book.id} 
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              {/* Book Title */}
              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                {book.title}
              </h3>
              
              {/* Author */}
              <p className="text-gray-600 mb-1">by {book.author}</p>
              
              {/* Category (if exists) */}
              {book.category && (
                <p className="text-sm text-gray-500 mb-3">
                  {book.category}
                </p>
              )}
              
              {/* Availability Status */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span 
                  className={`font-medium text-sm ${
                    book.availableQuantity > 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}
                >
                  {book.availableQuantity > 0 
                    ? `✓ ${book.availableQuantity} available` 
                    : '✗ Out of stock'
                  }
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Total: {book.totalQuantity} copies
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && books.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-4">
            {filter === 'available' 
              ? 'No books available for borrowing' 
              : 'No books in the library'}
          </p>
          <a 
            href="/books/add" 
            className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Add Your First Book
          </a>
        </div>
      )}
    </div>
  );
}
