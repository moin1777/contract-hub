import React from 'react';
import type { Contract } from '../types/contract';
import { Calendar, DollarSign, User, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContractCardProps {
  contract: Contract;
  onDelete: (id: string) => void;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract, onDelete }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      active: 'bg-emerald-50 text-emerald-700',
      draft: 'bg-gray-100 text-gray-600',
      expired: 'bg-amber-50 text-amber-700',
      terminated: 'bg-red-50 text-red-700',
    };
    return classes[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusClass(contract.status)}`}>
          {contract.status}
        </span>
        <div className="relative">
          <button
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-30 z-20">
                <Link
                  to={`/contracts/${contract.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Eye size={16} />
                  View
                </Link>
                <Link
                  to={`/contracts/${contract.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Edit size={16} />
                  Edit
                </Link>
                <button
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                  onClick={() => {
                    onDelete(contract.id);
                    setMenuOpen(false);
                  }}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Link to={`/contracts/${contract.id}`} className="block p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{contract.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{contract.description}</p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User size={14} />
            <span>{contract.clientName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <DollarSign size={14} />
            <span>{formatCurrency(contract.value)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} />
            <span>
              {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ContractCard;
