'use client';
import { useEffect, useState } from 'react';
import { borrowAPI } from '@/lib/api';
import { format } from 'date-fns';

/**
 * Active Borrows Page
 * 
 * Displays all currently borrowed books (status = BORROWED).
 * 
 * Features:
 * - List of all active borrow transactions
 * - Shows book, member, borrow date, due date
 * - Return button for each borrow
 * - Calculates fine if overdue on return
 * 
 * Data Flow:
 * 1. Fetch all active borrows
 * 2. Display with member and book details
 * 3. Return button triggers return API
 * 4. Backend calculates fine if late
 * 
 * Links To:
 * - borrowAPI.getActive() - fetch borrows with status=BORROWED
 * - borrowAPI.returnBook(id) - process book return
 */
export default function ActiveBorrows() {
  const [borrows, setBorrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch active borrows on page load
  useEffect(() => {
    fetchActiveBorrows();
  }, []);

  const fetchActiveBorrows = () => {
    borrowAPI.getActive()
      .then(res => {
        setBorrows(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading active borrows:', err);
        setLoading(false);
      });
  };

  // Handle return book click
  const handleReturn = async (id: number) => {
    if (!confirm('Mark this book as returned?')) return;

    try {
      const response = await borrowAPI.returnBook(id);
      
      // Check if there was a fine
      if (response.data.fine > 0) {
        alert(`Book returned!\nOverdue fine: ₹${response.data.fine.toFixed(2)}`);
      } else {
        alert('Book returned on time!');
      }
      
      // Remove from list
      setBorrows(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error returning book:', err);
      alert('Error returning book');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Currently Borrowed Books</h1>

      {loading && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      )}

      {/* Active Borrows List */}
      {!loading && (
        <div className="space-y-4">
          {borrows.map(b => (
            <div 
              key={b.id} 
              className="bg-white p-6 rounded-lg shadow flex justify-between items-center hover:shadow-md transition"
            >
              {/* Borrow Details */}
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {b.book.title}
                </h3>
                <p className="text-gray-600">
                  by {b.book.author}
                </p>
                <p className="mt-2">
                  Borrowed by: <strong>{b.member.name}</strong> ({b.member.membershipId})
                </p>
                <div className="flex gap-6 mt-2 text-sm">
                  <p className="text-gray-600">
                    Borrow Date: {format(new Date(b.borrowDate), 'dd MMM yyyy')}
                  </p>
                  <p className="text-red-600 font-medium">
                    Due Date: {format(new Date(b.dueDate), 'dd MMM yyyy')}
                  </p>
                </div>
                
                {/* Overdue Warning */}
                {new Date() > new Date(b.dueDate) && (
                  <p className="mt-2 text-red-700 font-bold text-sm">
                    ⚠️ OVERDUE - Fine will be calculated on return
                  </p>
                )}
              </div>

              {/* Return Button */}
              <button
                onClick={() => handleReturn(b.id)}
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition font-semibold"
              >
                Return Book
              </button>
            </div>
          ))}

          {/* Empty State */}
          {borrows.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No active borrows</p>
              <a 
                href="/borrow" 
                className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded hover:bg-blue-700"
              >
                Borrow a Book
              </a>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      {!loading && borrows.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          Total Active Borrows: <span className="font-bold">{borrows.length}</span>
        </div>
      )}
    </div>
  );
}
