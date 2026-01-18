import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { deleteContract, setSearchQuery, setFilterStatus } from '../../store/contractSlice';
import ContractCard from '../../components/ContractCard';
import SearchFilter from '../../components/SearchFilter';
import EmptyState from '../../components/EmptyState';
import './ContractList.css';

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
    <div className="contract-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Contracts</h1>
          <p className="page-subtitle">
            {contracts.length} contract{contracts.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link to="/contracts/new" className="btn-create">
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
        <div className="contracts-grid">
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
