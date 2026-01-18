import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, DollarSign, User, Clock } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { deleteContract } from '../../store/contractSlice';
import './ContractDetail.css';

const ContractDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const contract = useAppSelector((state) =>
    state.contracts.contracts.find((c) => c.id === id)
  );

  if (!contract) {
    return (
      <div className="contract-detail-page">
        <div className="not-found">
          <h2>Contract not found</h2>
          <p>The contract you're looking for doesn't exist.</p>
          <Link to="/contracts" className="btn-back">
            Back to Contracts
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      dispatch(deleteContract(contract.id));
      navigate('/contracts');
    }
  };

  return (
    <div className="contract-detail-page">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="header-actions">
          <Link to={`/contracts/${contract.id}/edit`} className="btn-edit">
            <Edit size={18} />
            Edit
          </Link>
          <button onClick={handleDelete} className="btn-delete">
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div className="title-section">
            <span className={`status-badge ${getStatusClass(contract.status)}`}>
              {contract.status}
            </span>
            <h1 className="contract-title">{contract.title}</h1>
          </div>

          {contract.description && (
            <div className="description-section">
              <h3>Description</h3>
              <p>{contract.description}</p>
            </div>
          )}
        </div>

        <div className="detail-sidebar">
          <div className="info-card">
            <h3>Contract Details</h3>
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">
                  <User size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Client</span>
                  <span className="info-value">{contract.clientName}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <DollarSign size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Value</span>
                  <span className="info-value">{formatCurrency(contract.value)}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Calendar size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Start Date</span>
                  <span className="info-value">{formatDate(contract.startDate)}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Calendar size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">End Date</span>
                  <span className="info-value">{formatDate(contract.endDate)}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Clock size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Last Updated</span>
                  <span className="info-value">
                    {new Date(contract.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
