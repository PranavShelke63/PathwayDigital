import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Query, queriesApi } from '../../services/api';

const QueryList: React.FC = () => {
  const { user } = useAuth();
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    subject: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await queriesApi.getAll();
        setQueries(response.data.data.queries);
      } catch (error: any) {
        console.error('Failed to fetch queries:', error);
        setError(error.response?.data?.message || 'Failed to fetch queries');
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredQueries = queries.filter((query) => {
    const nameMatch = query.name.toLowerCase().includes(filters.name.toLowerCase());
    const emailMatch = query.email.toLowerCase().includes(filters.email.toLowerCase());
    const subjectMatch = query.subject.toLowerCase().includes(filters.subject.toLowerCase());
    let dateFromMatch = true;
    let dateToMatch = true;
    if (filters.dateFrom) {
      dateFromMatch = new Date(query.createdAt) >= new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      // Add 1 day to include the end date
      const toDate = new Date(filters.dateTo);
      toDate.setDate(toDate.getDate() + 1);
      dateToMatch = new Date(query.createdAt) < toDate;
    }
    return nameMatch && emailMatch && subjectMatch && dateFromMatch && dateToMatch;
  });

  // Redirect if not admin
  if (!user || user.email !== 'pranavopshelke@gmail.com') {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-contrast">User Queries</h1>
        <p className="text-gray-600 mt-2">View and manage user inquiries and messages.</p>
      </div>

      {/* Filter Controls */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg shadow flex flex-col md:flex-row md:items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-2 py-1 w-full"
            placeholder="Filter by name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
          <input
            type="text"
            name="email"
            value={filters.email}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-2 py-1 w-full"
            placeholder="Filter by email"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={filters.subject}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-2 py-1 w-full"
            placeholder="Filter by subject"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Date From</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Date To</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="space-y-6 p-6">
          {filteredQueries.length === 0 ? (
            <div className="text-center text-gray-500">
              No queries found.
            </div>
          ) : (
            filteredQueries.map((query, idx) => (
              <div
                key={query._id}
                className="border border-gray-200 rounded-lg p-6 flex flex-col gap-2 bg-gray-50 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <span className="font-semibold text-gray-700">Sr. No:</span>
                  <span className="text-gray-900">{idx + 1}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <span className="font-semibold text-gray-700">Name:</span>
                  <span className="text-gray-900">{query.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="text-gray-900">{query.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <span className="font-semibold text-gray-700">Subject:</span>
                  <span className="text-gray-900 break-words">{query.subject}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                  <span className="font-semibold text-gray-700">Message:</span>
                  <span className="text-gray-900 break-words max-h-32 overflow-y-auto">{query.message}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <span className="font-semibold text-gray-700">Date:</span>
                  <span className="text-gray-900">
                    {new Date(query.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryList; 