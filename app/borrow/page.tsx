'use client';
import { useEffect, useState } from 'react';
import { booksAPI, membersAPI, borrowAPI } from '@/lib/api';

/**
 * Borrow Book Page
 * 
 * Main page for borrowing books - connects members with available books.
 * 
 * Features:
 * - Dropdown selection for available books
 * - Dropdown selection for active members
 * - One-click borrow process
 * - Links to view active borrows and overdue books
 * 
 * Business Rules (enforced by backend):
 * - Book must be available (availableQuantity > 0)
 * - Member must be ACTIVE
 * - Member cannot have more than 3 books
 * 
 * Links To:
 * - booksAPI.getAvailable() - fetch borrowable books
 * - membersAPI.getAll() - fetch all members
 * - borrowAPI.borrowBook() - process the borrow transaction
 */
export default function BorrowPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch available books and members on page load
  useEffect(() => {
    Promise.all([
      booksAPI.getAvailable(),
      membersAPI.getAll()
    ])
    .then(([booksRes, membersRes]) => {
      setBooks(booksRes.data);
      setMembers(membersRes.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error loading data:', err);
      setLoading(false);
    });
  }, []);

  // Handle borrow button click
  const handleBorrow = async () => {
    if (!selectedBook || !selectedMember) {
      alert('Please select both book and member');
      return;
    }

    try {
      await borrowAPI.borrowBook({ 
        bookId: +selectedBook, 
        memberId: +selectedMember 
      });
      alert('Book borrowed successfully! Due in 14 days');
      
      // Reset selections
      setSelectedBook('');
      setSelectedMember('');
      
      // Refresh available books
      const booksRes = await booksAPI.getAvailable();
      setBooks(booksRes.data);
    } catch (err: any) {
      console.error('Error borrowing book:', err);
      alert(err.response?.data?.message || 'Cannot borrow this book. Check member status and book limits.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-10">Borrow a Book</h1>

      {loading && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Selection Grid */}
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            {/* Book Selection */}
            <div>
              <label className="block text-lg font-medium mb-3">
                Select Available Book
              </label>
              <select 
                value={selectedBook} 
                onChange={e => setSelectedBook(e.target.value)} 
                className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">-- Choose a book --</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.title} by {book.author} ({book.availableQuantity} left)
                  </option>
                ))}
              </select>
              {books.length === 0 && (
                <p className="text-sm text-red-600 mt-2">
                  No books available for borrowing
                </p>
              )}
            </div>

            {/* Member Selection */}
            <div>
              <label className="block text-lg font-medium mb-3">
                Select Member
              </label>
              <select 
                value={selectedMember} 
                onChange={e => setSelectedMember(e.target.value)} 
                className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">-- Choose member --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.membershipId})
                  </option>
                ))}
              </select>
              {members.length === 0 && (
                <p className="text-sm text-red-600 mt-2">
                  No members registered
                </p>
              )}
            </div>
          </div>

          {/* Borrow Button */}
          <div className="text-center mb-12">
            <button
              onClick={handleBorrow}
              disabled={!selectedBook || !selectedMember}
              className="bg-primary text-white px-12 py-5 rounded-xl text-xl font-semibold hover:bg-blue-700 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Borrow Book Now
            </button>
            <p className="text-sm text-gray-600 mt-3">
              Due date will be 14 days from today
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-6 text-center">
            <a 
              href="/borrow/active" 
              className="bg-blue-100 p-6 rounded-lg hover:bg-blue-200 transition"
            >
              <h3 className="text-xl font-bold text-blue-800">Active Borrows</h3>
              <p className="text-sm text-blue-600 mt-2">View currently borrowed books</p>
            </a>
            <a 
              href="/borrow/overdue" 
              className="bg-red-100 p-6 rounded-lg hover:bg-red-200 transition"
            >
              <h3 className="text-xl font-bold text-red-700">Overdue Books</h3>
              <p className="text-sm text-red-600 mt-2">View late returns with fines</p>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
