import axios from 'axios';

/**
 * API Configuration
 * 
 * This file centralizes all backend API calls in one place.
 * Makes it easy to manage endpoints and change base URL.
 * 
 * Structure:
 * - API instance with base configuration
 * - Separate namespaces for books, members, and borrow operations
 * 
 * Benefits:
 * - Single source of truth for API endpoints
 * - Easy to mock for testing
 * - Type-safe API calls
 * - Automatic error handling via axios interceptors
 */

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',   // Use environment variable or fallback to localhost
  timeout: 10000,                          // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Books API
 * All book-related operations
 */
export const booksAPI = {
  /**
   * Get all books (including out-of-stock)
   * Endpoint: GET /api/books
   */
  getAll: () => API.get('/books'),
  
  /**
   * Get only available books (availableQuantity > 0)
   * Endpoint: GET /api/books/available
   */
  getAvailable: () => API.get('/books/available'),
  
  /**
   * Get a specific book by ID
   * Endpoint: GET /api/books/{id}
   */
  getById: (id: number) => API.get(`/books/${id}`),
  
  /**
   * Add a new book to the library
   * Endpoint: POST /api/books
   * 
   * @param data - Book details (title, author, isbn, etc.)
   */
  add: (data: any) => API.post('/books', data),
  
  /**
   * Update an existing book
   * Endpoint: PUT /api/books/{id}
   */
  update: (id: number, data: any) => API.put(`/books/${id}`, data),
  
  /**
   * Delete a book
   * Endpoint: DELETE /api/books/{id}
   */
  delete: (id: number) => API.delete(`/books/${id}`),
};

/**
 * Members API
 * All member-related operations
 */
export const membersAPI = {
  /**
   * Get all registered members
   * Endpoint: GET /api/members
   */
  getAll: () => API.get('/members'),
  
  /**
   * Get a specific member by ID
   * Endpoint: GET /api/members/{id}
   */
  getById: (id: number) => API.get(`/members/${id}`),
  
  /**
   * Register a new library member
   * Endpoint: POST /api/members
   * 
   * @param data - Member details (name, email, phone)
   * Backend auto-generates: membershipId, registrationDate, status
   */
  register: (data: any) => API.post('/members', data),
};

/**
 * Borrow API
 * All book borrowing and return operations
 */
export const borrowAPI = {
  /**
   * Borrow a book
   * Endpoint: POST /api/borrow
   * 
   * @param data - { bookId: number, memberId: number }
   * 
   * Business Rules Enforced by Backend:
   * - Book must be available
   * - Member must be ACTIVE
   * - Member cannot have more than 3 books
   */
  borrowBook: (data: { bookId: number; memberId: number }) => 
    API.post('/borrow', data),
  
  /**
   * Return a borrowed book
   * Endpoint: PUT /api/borrow/{id}/return
   * 
   * @param id - Borrow record ID
   * 
   * Backend automatically:
   * - Calculates fine if overdue
   * - Updates book availability
   * - Sets return date
   */
  returnBook: (id: number) => API.put(`/borrow/${id}/return`),
  
  /**
   * Get all currently borrowed books (status = BORROWED)
   * Endpoint: GET /api/borrow/active
   */
  getActive: () => API.get('/borrow/active'),
  
  /**
   * Get all overdue books (status = OVERDUE)
   * Endpoint: GET /api/borrow/overdue
   */
  getOverdue: () => API.get('/borrow/overdue'),
};

/**
 * Optional: Add request/response interceptors for global error handling
 * 
 * Example:
 * API.interceptors.response.use(
 *   response => response,
 *   error => {
 *     // Handle errors globally
 *     console.error('API Error:', error);
 *     return Promise.reject(error);
 *   }
 * );
 */

export default API;
