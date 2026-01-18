import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateContract } from '../../store/contractSlice';
import ContractForm from '../../components/ContractForm';
import type { ContractFormData } from '../../types/contract';
import './EditContract.css';

const EditContract: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const contract = useAppSelector((state) =>
    state.contracts.contracts.find((c) => c.id === id)
  );

  if (!contract) {
    return (
      <div className="edit-contract-page">
        <div className="not-found">
          <h2>Contract not found</h2>
          <p>The contract you're trying to edit doesn't exist.</p>
          <button onClick={() => navigate('/contracts')} className="btn-back">
            Back to Contracts
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (data: ContractFormData) => {
    dispatch(updateContract({ id: contract.id, data }));
    navigate(`/contracts/${contract.id}`);
  };

  return (
    <div className="edit-contract-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="page-title">Edit Contract</h1>
        <p className="page-subtitle">Update the contract details</p>
      </div>

      <ContractForm
        initialData={contract}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        isEditing
      />
    </div>
  );
};

export default EditContract;
