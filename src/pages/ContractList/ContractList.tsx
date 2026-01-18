import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { deleteContract, setSearchQuery, setFilterStatus } from '../../store/contractSlice';
import ContractCard from '../../components/ContractCard';
import SearchFilter from '../../components/SearchFilter';
import EmptyState from '../../components/EmptyState';

const ContractList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { contracts, searchQuery, filterStatus } = useAppSelector(
    (state) => state.contracts
  );

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || contract.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const sortedContracts = [...filteredContracts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      dispatch(deleteContract(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
          <p className="text-gray-500 mt-1">
            {contracts.length} contract{contracts.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          to="/contracts/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          New Contract
        </Link>
      </div>

      <SearchFilter
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        onSearchChange={(query) => dispatch(setSearchQuery(query))}
        onFilterChange={(status) => dispatch(setFilterStatus(status))}
      />

      {sortedContracts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : contracts.length > 0 ? (
        <EmptyState
          title="No contracts found"
          description="Try adjusting your search or filter to find what you're looking for."
        />
      ) : (
        <EmptyState
          title="No contracts yet"
          description="Create your first contract to get started."
          actionLabel="Create Contract"
          actionLink="/contracts/new"
        />
      )}
    </div>
  );
};

export default ContractList;
