import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

/**
 * Root Layout Component
 * 
 * This is the top-level layout for the entire application.
 * Every page in the app is wrapped by this layout.
 * 
 * Features:
 * - Includes Navbar on every page
 * - Sets up global fonts (Inter)
 * - Defines metadata (title, description for SEO)
 * - Applies global styles
 * 
 * Structure:
 * - <html> root with language
 * - <body> with font and styling
 * - <Navbar> for navigation
 * - <main> where page content renders
 * 
 * The {children} prop contains the actual page content
 * from app/page.tsx, app/books/page.tsx, etc.
 */

// Load Inter font from Google Fonts
const inter = Inter({ subsets: ["latin"] });

// Metadata for SEO and browser tabs
export const metadata: Metadata = {
  title: "Library Management System",
  description: "Modern Library Management with Spring Boot + Next.js",
};

/**
 * Root Layout function
 * Wraps all pages in the application
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation bar - appears on all pages */}
        <Navbar />
        
        {/* Main content area - light gray background */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
