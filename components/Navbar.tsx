'use client';
import Link from 'next/link';
import { BookOpen, Users, ArrowRightLeft, Home } from 'lucide-react';

/**
 * Navbar Component
 * 
 * Main navigation bar displayed on all pages via the root layout.
 * Provides links to all major sections of the application.
 * 
 * Features:
 * - Responsive design (mobile-friendly)
 * - Active state highlighting
 * - Icon + text navigation
 * - Sticky positioning on scroll
 * 
 * Links:
 * - Dashboard: Home page with statistics
 * - Books: View and manage books
 * - Members: View and register members
 * - Borrow: Borrowing and return operations
 * 
 * Used in: app/layout.tsx (root layout)
 */
export default function Navbar() {
  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold hover:opacity-80 transition">
              <BookOpen className="w-8 h-8" />
              <span>Library LMS</span>
            </Link>
            
            {/* Desktop navigation links */}
            <div className="hidden md:flex space-x-6">
              <Link 
                href="/" 
                className="hover:bg-blue-700 px-3 py-2 rounded flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              
              <Link 
                href="/books" 
                className="hover:bg-blue-700 px-3 py-2 rounded flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Books
              </Link>
              
              <Link 
                href="/members" 
                className="hover:bg-blue-700 px-3 py-2 rounded flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Members
              </Link>
              
              <Link 
                href="/borrow" 
                className="hover:bg-blue-700 px-3 py-2 rounded flex items-center gap-2"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Borrow
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu (can be expanded with hamburger menu) */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="bg-blue-700 px-3 py-1 rounded text-sm">Dashboard</Link>
          <Link href="/books" className="bg-blue-700 px-3 py-1 rounded text-sm">Books</Link>
          <Link href="/members" className="bg-blue-700 px-3 py-1 rounded text-sm">Members</Link>
          <Link href="/borrow" className="bg-blue-700 px-3 py-1 rounded text-sm">Borrow</Link>
        </div>
      </div>
    </nav>
  );
}
