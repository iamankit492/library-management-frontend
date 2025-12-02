'use client';
import { useEffect, useState } from 'react';
import { borrowAPI } from '@/lib/api';
import { format } from 'date-fns';

/**
 * Overdue Books Page
 * 
 * Displays all books that were returned late with fines.
 * 
 * Features:
 * - List of all overdue returns (status = OVERDUE)
 * - Shows book, member, due date, return date
 * - Displays calculated fine amount
 * - Red/warning theme for urgency
 * 
 * Fine Calculation:
 * - Fine = (days late) × ₹10 per day
 * - Example: 4 days late = 4 × 10 = ₹40
 * - Calculated automatically by backend on return
 * 
 * Links To:
 * - borrowAPI.getOverdue() - fetch borrows with status=OVERDUE
 * - Shows historical data (books already returned)
 */
export default function OverduePage() {
  const [overdue, setOverdue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch overdue books on page load
  useEffect(() => {
    borrowAPI.getOverdue()
      .then(res => {
        setOverdue(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading overdue books:', err);
        setLoading(false);
      });
  }, []);

  // Calculate total fines
  const totalFines = overdue.reduce((sum, b) => sum + b.fine, 0);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">
        Overdue Books
      </h1>

      {loading && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      )}

      {/* Overdue Books List */}
      {!loading && (
        <div className="space-y-6">
          {overdue.map(b => (
            <div 
              key={b.id} 
              className="bg-red-50 border-2 border-red-300 p-6 rounded-lg"
            >
              <div className="flex justify-between items-start">
                {/* Book and Member Details */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {b.book.title} <span className="text-gray-600">– {b.book.author}</span>
                  </h3>
                  
                  <p className="text-lg mt-2">
                    Borrowed by: <strong>{b.member.name}</strong>
                  </p>
                  
                  <p className="text-sm text-gray-600">
                    Membership ID: {b.member.membershipId}
                  </p>
                  
                  <div className="mt-3 flex gap-8">
                    <div>
                      <p className="text-sm text-gray-600">Due Date</p>
                      <p className="text-lg font-bold text-red-700">
                        {format(new Date(b.dueDate), 'dd MMM yyyy')}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Return Date</p>
                      <p className="text-lg font-bold text-red-800">
                        {format(new Date(b.returnDate), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Fine Amount */}
                  <div className="mt-4 bg-red-100 inline-block px-4 py-2 rounded">
                    <p className="text-sm text-red-700">Fine Amount</p>
                    <p className="text-3xl font-bold text-red-700">
                      ₹{b.fine.toFixed(2)}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      (₹10 per day overdue)
                    </p>
                  </div>
                </div>

                {/* Days Late Badge */}
                <div className="text-right">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-full">
                    <p className="text-sm">Days Late</p>
                    <p className="text-2xl font-bold">
                      {Math.round(b.fine / 10)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {overdue.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600 mb-2">
                No overdue books – Great job!
              </p>
              <p className="text-gray-500">
                All books have been returned on time
              </p>
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      {!loading && overdue.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow text-center">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600">Total Overdue Returns</p>
              <p className="text-3xl font-bold text-red-600">{overdue.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Fines Collected</p>
              <p className="text-3xl font-bold text-red-600">
                ₹{totalFines.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
