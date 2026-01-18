import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchFilterProps {
  searchQuery: string;
  filterStatus: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (status: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  filterStatus,
  onSearchChange,
  onFilterChange,
}) => {
  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'expired', label: 'Expired' },
    { value: 'terminated', label: 'Terminated' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Search contracts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        {statuses.map((status) => (
          <button
            key={status.value}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              filterStatus === status.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onFilterChange(status.value)}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
