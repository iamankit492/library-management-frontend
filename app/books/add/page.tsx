'use client';
import { useState } from 'react';
import { booksAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

/**
 * Add Book Page
 * 
 * Form page to add a new book to the library inventory.
 * 
 * Features:
 * - Complete form with validation
 * - ISBN pattern validation (10 or 13 digits)
 * - Success/error feedback
 * - Redirects to books page after success
 * 
 * Form Fields:
 * - Title (required)
 * - Author (required)
 * - ISBN (required, validated)
 * - Category (optional)
 * - Total Quantity (required, minimum 1)
 * - Publication Year (optional)
 * 
 * Links To:
 * - booksAPI.add() - POST request to backend
 * - Backend validates and saves book
 * - availableQuantity auto-set by backend
 */
export default function AddBook() {
  const router = useRouter();
  
  // Form state
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalQuantity: 1,
    publicationYear: 2023
  });

  const [submitting, setSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await booksAPI.add(form);
      alert('Book added successfully!');
      router.push('/books'); // Redirect to books page
    } catch (err: any) {
      console.error('Error adding book:', err);
      alert(err.response?.data?.message || 'Error adding book. Please check ISBN uniqueness.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Book</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        {/* Book Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Book Title *
          </label>
          <input
            type="text"
            placeholder="Enter book title"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author *
          </label>
          <input
            type="text"
            placeholder="Enter author name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={form.author}
            onChange={e => setForm({...form, author: e.target.value})}
          />
        </div>

        {/* ISBN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ISBN (10 or 13 digits) *
          </label>
          <input
            type="text"
            placeholder="1234567890 or 1234567890123"
            required
            pattern="\d{10}|\d{13}"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={form.isbn}
            onChange={e => setForm({...form, isbn: e.target.value})}
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be exactly 10 or 13 digits
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Fiction, Science, Programming"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
          />
        </div>

        {/* Total Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Copies *
          </label>
          <input
            type="number"
            placeholder="Number of copies"
            min="1"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={form.totalQuantity}
            onChange={e => setForm({...form, totalQuantity: +e.target.value})}
          />
        </div>

        {/* Publication Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Publication Year (Optional)
          </label>
          <input
            type="number"
            placeholder="e.g., 2023"
            min="1000"
            max="2100"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={form.publicationYear}
            onChange={e => setForm({...form, publicationYear: +e.target.value})}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Adding Book...' : 'Add Book'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
