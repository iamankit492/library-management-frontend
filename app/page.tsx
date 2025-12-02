'use client';
import { useEffect, useState } from 'react';
import { booksAPI, membersAPI, borrowAPI } from '@/lib/api';
import { BookOpen, Users, AlertCircle, ArrowRightLeft } from 'lucide-react';

/**
 * Home Page / Dashboard
 * 
 * Main landing page showing library statistics and quick actions.
 * 
 * Features:
 * - Real-time statistics (total books, members, overdue count)
 * - Quick action cards for common operations
 * - Visual stats with icons
 * - Responsive grid layout
 * 
 * Data Flow:
 * 1. On page load, fetch data from all 3 APIs in parallel
 * 2. Calculate statistics from responses
 * 3. Display in cards
 * 
 * Links To:
 * - booksAPI.getAll() - count total books
 * - membersAPI.getAll() - count total members
 * - borrowAPI.getOverdue() - count overdue books
 */
export default function Home() {
  // State to hold dashboard statistics
  const [stats, setStats] = useState({ 
    books: 0, 
    members: 0, 
    overdue: 0 
  });

  const [loading, setLoading] = useState(true);

  // Fetch all statistics when page loads
  useEffect(() => {
    Promise.all([
      booksAPI.getAll(),
      membersAPI.getAll(),
      borrowAPI.getOverdue()
    ])
    .then(([booksRes, membersRes, overdueRes]) => {
      setStats({
        books: booksRes.data.length,
        members: membersRes.data.length,
        overdue: overdueRes.data.length
      });
      setLoading(false);
    })
    .catch(err => {
      console.error('Error loading dashboard:', err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Page header */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Library Dashboard
      </h1>
      
      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Books Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Books</p>
              <p className="text-3xl font-bold text-primary mt-2">
                {loading ? '...' : stats.books}
              </p>
            </div>
            <BookOpen className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Total Members Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Members</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {loading ? '...' : stats.members}
              </p>
            </div>
            <Users className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Overdue Books Card - Red for urgency */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Overdue Books</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {loading ? '...' : stats.overdue}
              </p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manage Books Action Card */}
        <a 
          href="/books" 
          className="bg-primary text-white p-10 rounded-lg text-center hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
        >
          <BookOpen className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold">Manage Books</h3>
          <p className="mt-2 text-blue-100">View, add, and manage library inventory</p>
        </a>

        {/* Borrow/Return Action Card */}
        <a 
          href="/borrow" 
          className="bg-green-600 text-white p-10 rounded-lg text-center hover:bg-green-700 transition shadow-lg hover:shadow-xl"
        >
          <ArrowRightLeft className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold">Borrow / Return</h3>
          <p className="mt-2 text-green-100">Process book borrowing and returns</p>
        </a>
      </div>

      {/* Additional Quick Links */}
      <div className="mt-6 flex justify-center gap-4">
        <a 
          href="/members/register" 
          className="bg-white px-6 py-3 rounded-lg shadow hover:shadow-md transition border border-gray-200"
        >
          Register New Member
        </a>
        <a 
          href="/books/add" 
          className="bg-white px-6 py-3 rounded-lg shadow hover:shadow-md transition border border-gray-200"
        >
          Add New Book
        </a>
      </div>
    </div>
  );
}
