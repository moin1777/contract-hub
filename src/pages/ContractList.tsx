import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronRight,
  CheckCircle,
  Send,
  FileSignature,
  Lock,
  XCircle,
  MoreVertical,
  FileText,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteContract, setSearchQuery, setFilterStatus, changeContractStatus } from '../store/contractSlice';
import EmptyState from '../components/EmptyState';
import type { Contract, ContractStatus } from '../types/contract';
import { statusTransitions, statusInfo } from '../types/contract';

type ViewMode = 'table' | 'grid';

const ContractList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { contracts, searchQuery, filterStatus } = useAppSelector(
    (state) => state.contracts
  );
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      dispatch(deleteContract(id));
    }
    setOpenMenuId(null);
  };

  const handleStatusChange = (id: string, newStatus: ContractStatus) => {
    dispatch(changeContractStatus({ id, newStatus }));
    setOpenMenuId(null);
  };

  const getNextActions = (contract: Contract) => {
    const allowedTransitions = statusTransitions[contract.status];
    return allowedTransitions;
  };

  const getActionIcon = (status: ContractStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={14} />;
      case 'sent':
        return <Send size={14} />;
      case 'signed':
        return <FileSignature size={14} />;
      case 'locked':
        return <Lock size={14} />;
      case 'revoked':
        return <XCircle size={14} />;
      default:
        return <ChevronRight size={14} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const canEdit = (contract: Contract) => {
    return contract.status !== 'locked' && contract.status !== 'revoked';
  };

  // Status counts for filter tabs
  const statusCounts = {
    all: contracts.length,
    created: contracts.filter((c) => c.status === 'created').length,
    approved: contracts.filter((c) => c.status === 'approved').length,
    sent: contracts.filter((c) => c.status === 'sent').length,
    signed: contracts.filter((c) => c.status === 'signed').length,
    locked: contracts.filter((c) => c.status === 'locked').length,
    revoked: contracts.filter((c) => c.status === 'revoked').length,
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
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Table view"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <Link
            to="/contracts/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            New Contract
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-200">
        {(['all', 'created', 'approved', 'sent', 'signed', 'locked', 'revoked'] as const).map((status) => (
          <button
            key={status}
            onClick={() => dispatch(setFilterStatus(status))}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              filterStatus === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : statusInfo[status]?.label || status}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              filterStatus === status ? 'bg-indigo-500' : 'bg-gray-200'
            }`}>
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search contracts..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {sortedContracts.length > 0 ? (
        viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contract Name
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Blueprint
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedContracts.map((contract) => {
                    const info = statusInfo[contract.status] || { label: contract.status, color: 'text-gray-700', bgColor: 'bg-gray-100' };
                    const nextActions = getNextActions(contract);
                    
                    return (
                      <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                              <FileText size={18} className="text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{contract.title}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{contract.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {contract.blueprintName ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm bg-gray-100 text-gray-700">
                              {contract.blueprintName}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${info.bgColor} ${info.color}`}>
                            {info.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(contract.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {contract.clientName}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-3">
                            {/* Quick action buttons for status change */}
                            {nextActions.filter(s => s !== 'revoked').length > 0 && (
                              <div className="hidden lg:flex gap-1.5">
                                {nextActions.filter(s => s !== 'revoked').map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusChange(contract.id, status)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 hover:border-indigo-200"
                                    title={`Mark as ${statusInfo[status]?.label || status}`}
                                  >
                                    {getActionIcon(status)}
                                    <span>{statusInfo[status]?.label || status}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {/* More actions dropdown */}
                            <div className="relative">
                              <button
                                onClick={() => setOpenMenuId(openMenuId === contract.id ? null : contract.id)}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                              >
                                <MoreVertical size={16} className="text-gray-500" />
                              </button>
                              {openMenuId === contract.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setOpenMenuId(null)}
                                  />
                                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 overflow-hidden">
                                    <div className="px-3 py-2 border-b border-gray-100">
                                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Actions</p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        navigate(`/contracts/${contract.id}`);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                                    >
                                      <Eye size={16} className="text-gray-400" />
                                      View Details
                                    </button>
                                    {canEdit(contract) && (
                                      <button
                                        onClick={() => {
                                          navigate(`/contracts/${contract.id}/edit`);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                                      >
                                        <Edit2 size={16} className="text-gray-400" />
                                        Edit Contract
                                      </button>
                                    )}
                                    
                                    {/* Mobile-only status actions */}
                                    {nextActions.filter(s => s !== 'revoked').length > 0 && (
                                      <div className="lg:hidden border-t border-gray-100 mt-1 pt-1">
                                        <div className="px-3 py-2">
                                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Change Status</p>
                                        </div>
                                        {nextActions.filter(s => s !== 'revoked').map((status) => (
                                          <button
                                            key={status}
                                            onClick={() => handleStatusChange(contract.id, status)}
                                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-50 flex items-center gap-3 text-indigo-600 transition-colors"
                                          >
                                            {getActionIcon(status)}
                                            Mark as {statusInfo[status]?.label || status}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                    
                                    {(nextActions.includes('revoked') || true) && (
                                      <div className="border-t border-gray-100 mt-1 pt-1">
                                        {nextActions.includes('revoked') && (
                                          <button
                                            onClick={() => handleStatusChange(contract.id, 'revoked')}
                                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                                          >
                                            <XCircle size={16} />
                                            Revoke Contract
                                          </button>
                                        )}
                                        <button
                                          onClick={() => handleDelete(contract.id)}
                                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                                        >
                                          <Trash2 size={16} />
                                          Delete Contract
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedContracts.map((contract) => {
              const info = statusInfo[contract.status] || { label: contract.status, color: 'text-gray-700', bgColor: 'bg-gray-100' };
              const nextActions = getNextActions(contract);
              
              return (
                <div
                  key={contract.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <FileText size={18} className="text-indigo-600" />
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${info.bgColor} ${info.color}`}>
                        {info.label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{contract.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{contract.description}</p>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Client</span>
                      <span className="text-gray-900">{contract.clientName}</span>
                    </div>
                    {contract.blueprintName && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Blueprint</span>
                        <span className="text-gray-900">{contract.blueprintName}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created</span>
                      <span className="text-gray-900">{formatDate(contract.createdAt)}</span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100 space-y-2">
                    <div className="flex gap-2">
                      <Link
                        to={`/contracts/${contract.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Eye size={14} />
                        View
                      </Link>
                      {canEdit(contract) && (
                        <Link
                          to={`/contracts/${contract.id}/edit`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Edit2 size={14} />
                          Edit
                        </Link>
                      )}
                    </div>
                    {nextActions.filter(s => s !== 'revoked').length > 0 && (
                      <div className="flex gap-2">
                        {nextActions.filter(s => s !== 'revoked').map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(contract.id, status)}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            {getActionIcon(status)}
                            {statusInfo[status].label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
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
