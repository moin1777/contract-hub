import React from 'react';
import type { Contract } from '../../types/contract';
import { Calendar, DollarSign, User, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ContractCard.css';

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
      active: 'status-active',
      draft: 'status-draft',
      expired: 'status-expired',
      terminated: 'status-terminated',
    };
    return classes[status] || 'status-draft';
  };

  return (
    <div className="contract-card">
      <div className="card-header">
        <span className={`status-badge ${getStatusClass(contract.status)}`}>
          {contract.status}
        </span>
        <div className="card-menu">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <>
              <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
              <div className="menu-dropdown">
                <Link
                  to={`/contracts/${contract.id}`}
                  className="menu-item"
                  onClick={() => setMenuOpen(false)}
                >
                  <Eye size={16} />
                  View
                </Link>
                <Link
                  to={`/contracts/${contract.id}/edit`}
                  className="menu-item"
                  onClick={() => setMenuOpen(false)}
                >
                  <Edit size={16} />
                  Edit
                </Link>
                <button
                  className="menu-item danger"
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

      <Link to={`/contracts/${contract.id}`} className="card-body">
        <h3 className="card-title">{contract.title}</h3>
        <p className="card-description">{contract.description}</p>

        <div className="card-meta">
          <div className="meta-item">
            <User size={14} />
            <span>{contract.clientName}</span>
          </div>
          <div className="meta-item">
            <DollarSign size={14} />
            <span>{formatCurrency(contract.value)}</span>
          </div>
          <div className="meta-item">
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
