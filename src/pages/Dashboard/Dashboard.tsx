import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import StatCard from '../../components/StatCard';
import ContractCard from '../../components/ContractCard';
import EmptyState from '../../components/EmptyState';
import { useAppDispatch } from '../../store/hooks';
import { deleteContract } from '../../store/contractSlice';
import './Dashboard.css';

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
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage and track all your contracts in one place
          </p>
        </div>
        <Link to="/contracts/new" className="btn-create">
          <Plus size={20} />
          New Contract
        </Link>
      </div>

      <div className="stats-grid">
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

      <section className="recent-section">
        <div className="section-header">
          <h2 className="section-title">Recent Contracts</h2>
          {contracts.length > 0 && (
            <Link to="/contracts" className="view-all">
              View all
            </Link>
          )}
        </div>

        {recentContracts.length > 0 ? (
          <div className="contracts-grid">
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
