import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  User, 
  Clock,
  CheckCircle,
  Send,
  FileSignature,
  Lock,
  XCircle,
  ChevronRight,
  FileText,
  Layers,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteContract, changeContractStatus } from '../store/contractSlice';
import type { ContractStatus } from '../types/contract';
import { statusTransitions, statusInfo } from '../types/contract';

const lifecycleSteps: ContractStatus[] = ['created', 'approved', 'sent', 'signed', 'locked'];

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

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      dispatch(deleteContract(contract.id));
      navigate('/contracts');
    }
  };

  const handleStatusChange = (newStatus: ContractStatus) => {
    dispatch(changeContractStatus({ id: contract.id, newStatus }));
  };

  const allowedTransitions = statusTransitions[contract.status];
  const canEdit = contract.status !== 'locked' && contract.status !== 'revoked';
  const isRevoked = contract.status === 'revoked';
  
  const currentStepIndex = lifecycleSteps.indexOf(contract.status);

  const getActionIcon = (status: ContractStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={18} />;
      case 'sent':
        return <Send size={18} />;
      case 'signed':
        return <FileSignature size={18} />;
      case 'locked':
        return <Lock size={18} />;
      case 'revoked':
        return <XCircle size={18} />;
      default:
        return <ChevronRight size={18} />;
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
          {canEdit && (
            <Link
              to={`/contracts/${contract.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <Edit size={18} />
              Edit
            </Link>
          )}
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Contract Lifecycle Progress */}
      {!isRevoked && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Lifecycle</h3>
          <div className="flex items-center justify-between">
            {lifecycleSteps.map((step, index) => {
              const info = statusInfo[step];
              const isCompleted = currentStepIndex >= index;
              const isCurrent = contract.status === step;
              
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCurrent
                          ? 'bg-indigo-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {getActionIcon(step)}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {info.label}
                    </span>
                  </div>
                  {index < lifecycleSteps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        currentStepIndex > index ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Revoked Banner */}
      {isRevoked && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="text-red-600" size={20} />
          </div>
          <div>
            <p className="font-medium text-red-800">This contract has been revoked</p>
            <p className="text-sm text-red-600">It cannot be edited or proceed further in the lifecycle.</p>
          </div>
        </div>
      )}

      {/* Available Actions */}
      {allowedTransitions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Actions</h3>
          <div className="flex flex-wrap gap-3">
            {allowedTransitions.filter(s => s !== 'revoked').map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                {getActionIcon(status)}
                Mark as {statusInfo[status].label}
              </button>
            ))}
            {allowedTransitions.includes('revoked') && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to revoke this contract? This action cannot be undone.')) {
                    handleStatusChange('revoked');
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                <XCircle size={18} />
                Revoke Contract
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              {(() => {
                const info = statusInfo[contract.status] || { label: contract.status, color: 'text-gray-700', bgColor: 'bg-gray-100' };
                return (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${info.bgColor} ${info.color}`}>
                    {info.label}
                  </span>
                );
              })()}
              {contract.blueprintName && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  <Layers size={12} />
                  {contract.blueprintName}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{contract.title}</h1>
          </div>

          {contract.description && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{contract.description}</p>
            </div>
          )}

          {/* Custom Fields */}
          {contract.customFields && contract.customFields.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contract.customFields.map((field) => (
                  <div key={field.fieldId} className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{field.label}</span>
                    {field.type === 'checkbox' ? (
                      <p className="text-gray-900 font-medium mt-1">{field.value ? 'Yes' : 'No'}</p>
                    ) : field.type === 'signature' ? (
                      <p className="text-xl italic font-serif text-gray-800 mt-1">{field.value as string}</p>
                    ) : (
                      <p className="text-gray-900 font-medium mt-1">{field.value as string || '—'}</p>
                    )}
                  </div>
                ))}
              </div>
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

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-gray-500" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</span>
                <p className="text-gray-900 font-medium">
                  {new Date(contract.createdAt).toLocaleString()}
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
