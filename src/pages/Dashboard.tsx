import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import StatCard from '../components/StatCard';
import ContractCard from '../components/ContractCard';
import EmptyState from '../components/EmptyState';
import { useAppDispatch } from '../store/hooks';
import { deleteContract } from '../store/contractSlice';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { contracts } = useAppSelector((state) => state.contracts);

  const stats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === 'active').length,
    draft: contracts.filter((c) => c.status === 'draft').length,
    expired: contracts.filter((c) => c.status === 'expired').length,
    totalValue: contracts.reduce((sum, c) => sum + c.value, 0),
  };

  const recentContracts = [...contracts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      dispatch(deleteContract(id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage and track all your contracts in one place
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard title="Total Contracts" value={stats.total} icon={FileText} color="indigo" />
        <StatCard title="Active" value={stats.active} icon={CheckCircle} color="green" />
        <StatCard title="Draft" value={stats.draft} icon={Clock} color="gray" />
        <StatCard title="Expired" value={stats.expired} icon={XCircle} color="yellow" />
        <StatCard
          title="Total Value"
          value={formatCurrency(stats.totalValue)}
          icon={DollarSign}
          color="indigo"
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Contracts</h2>
          {contracts.length > 0 && (
            <Link to="/contracts" className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
              View all
            </Link>
          )}
        </div>

        {recentContracts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentContracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No contracts yet"
            description="Create your first contract to get started with managing your agreements."
            actionLabel="Create Contract"
            actionLink="/contracts/new"
          />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
