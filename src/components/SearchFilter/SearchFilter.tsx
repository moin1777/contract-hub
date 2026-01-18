import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchFilter.css';

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
    <div className="search-filter">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search contracts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="clear-button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-tabs">
        {statuses.map((status) => (
          <button
            key={status.value}
            className={`filter-tab ${filterStatus === status.value ? 'active' : ''}`}
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
