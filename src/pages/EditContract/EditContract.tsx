import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateContract } from '../../store/contractSlice';
import ContractForm from '../../components/ContractForm';
import type { ContractFormData } from '../../types/contract';

const EditContract: React.FC = () => {
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
        <p className="text-gray-500 mb-4">The contract you're trying to edit doesn't exist.</p>
        <button
          onClick={() => navigate('/contracts')}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Back to Contracts
        </button>
      </div>
    );
  }

  const handleSubmit = (data: ContractFormData) => {
    dispatch(updateContract({ id: contract.id, data }));
    navigate(`/contracts/${contract.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Contract</h1>
        <p className="text-gray-500">Update the contract details</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ContractForm
          initialData={contract}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          isEditing
        />
      </div>
    </div>
  );
};

export default EditContract;
