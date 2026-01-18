import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, DollarSign, User, Clock } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteContract } from '../store/contractSlice';

const ContractDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const contract = useAppSelector((state) =>
    state.contracts.contracts.find((c) => c.id === id)
  );

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Contract not found</h2>
        <p className="text-gray-500 mb-4">The contract you're looking for doesn't exist.</p>
        <Link
          to="/contracts"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Back to Contracts
        </Link>
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
      active: 'bg-emerald-50 text-emerald-700',
      draft: 'bg-gray-100 text-gray-600',
      expired: 'bg-amber-50 text-amber-700',
      terminated: 'bg-red-50 text-red-700',
    };
    return classes[status] || 'bg-gray-100 text-gray-600';
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      dispatch(deleteContract(contract.id));
      navigate('/contracts');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="flex gap-3">
          <Link
            to={`/contracts/${contract.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <Edit size={18} />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4 ${getStatusClass(contract.status)}`}>
              {contract.status}
            </span>
            <h1 className="text-2xl font-bold text-gray-900">{contract.title}</h1>
          </div>

          {contract.description && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{contract.description}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Details</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-gray-500" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Client</span>
                <p className="text-gray-900 font-medium">{contract.clientName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <DollarSign size={18} className="text-gray-500" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Value</span>
                <p className="text-gray-900 font-medium">{formatCurrency(contract.value)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-gray-500" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Start Date</span>
                <p className="text-gray-900 font-medium">{formatDate(contract.startDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-gray-500" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">End Date</span>
                <p className="text-gray-900 font-medium">{formatDate(contract.endDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-gray-500" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Updated</span>
                <p className="text-gray-900 font-medium">
                  {new Date(contract.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
