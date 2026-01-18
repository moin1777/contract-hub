import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addContract } from '../../store/contractSlice';
import ContractForm from '../../components/ContractForm';
import type { ContractFormData } from '../../types/contract';
import './CreateContract.css';

const CreateContract: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (data: ContractFormData) => {
    dispatch(addContract(data));
    navigate('/contracts');
  };

  return (
    <div className="create-contract-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="page-title">Create New Contract</h1>
        <p className="page-subtitle">Fill in the details to create a new contract</p>
      </div>

      <ContractForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
};

export default CreateContract;
