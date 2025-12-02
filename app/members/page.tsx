'use client';
import { useEffect, useState } from 'react';
import { membersAPI } from '@/lib/api';

/**
 * Members Page - View All Library Members
 * 
 * Displays all registered library members in a table format.
 * 
 * Features:
 * - Table view with all member details
 * - Membership ID, name, email, phone, status
 * - Status badge (ACTIVE/SUSPENDED)
 * - Quick link to register new members
 * 
 * Data Flow:
 * 1. On page load, fetch all members
 * 2. Display in sortable table
 * 3. Color-coded status badges
 * 
 * Links To:
 * - membersAPI.getAll() - fetch all members
 * - /members/register - page to register new member
 */

// TypeScript interface for Member data
interface Member {
  id: number;
  name: string;
  email: string;
  membershipId: string;
  phone: string;
  registrationDate: string;
  status: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all members on page load
  useEffect(() => {
    membersAPI.getAll()
      .then(res => {
        setMembers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading members:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Library Members</h1>
        
        {/* Register New Member Button */}
        <a 
          href="/members/register" 
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 flex items-center gap-2 transition"
        >
          + Register New Member
        </a>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Loading members...</p>
        </div>
      )}

      {/* Members Table */}
      {!loading && members.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Membership ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  {/* Member Name */}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {m.name}
                  </td>
                  
                  {/* Membership ID - Monospace font for ID */}
                  <td className="px-6 py-4 text-primary font-mono font-semibold">
                    {m.membershipId}
                  </td>
                  
                  {/* Email */}
                  <td className="px-6 py-4 text-gray-600">
                    {m.email}
                  </td>
                  
                  {/* Phone */}
                  <td className="px-6 py-4 text-gray-600">
                    {m.phone}
                  </td>
                  
                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        m.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && members.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-4">No members registered yet</p>
          <a 
            href="/members/register" 
            className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Register First Member
          </a>
        </div>
      )}

      {/* Member Count */}
      {!loading && members.length > 0 && (
        <div className="mt-4 text-center text-gray-600">
          Total Members: <span className="font-bold">{members.length}</span>
        </div>
      )}
    </div>
  );
}
