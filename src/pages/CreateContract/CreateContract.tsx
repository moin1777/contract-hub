import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addContract } from '../../store/contractSlice';
import ContractForm from '../../components/ContractForm';
import BlueprintSelector from '../../components/BlueprintSelector';
import type { ContractFormData } from '../../types/contract';
import type { Blueprint } from '../../types/blueprint';
import './CreateContract.css';

type CreateStep = 'blueprint' | 'form';

interface LocationState {
  blueprint?: Blueprint;
}

const CreateContract: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  // Check if we came from the Blueprints page with a pre-selected blueprint
  const stateBlueprint = (location.state as LocationState)?.blueprint;
  
  const [step, setStep] = useState<CreateStep>(stateBlueprint ? 'form' : 'blueprint');
  const [initialData, setInitialData] = useState<Partial<ContractFormData> | undefined>(
    stateBlueprint?.template
  );
  const [selectedBlueprintName, setSelectedBlueprintName] = useState<string | null>(
    stateBlueprint?.name || null
  );

  // Clear the location state after reading it
  useEffect(() => {
    if (stateBlueprint) {
      window.history.replaceState({}, document.title);
    }
  }, [stateBlueprint]);

  const handleSubmit = (data: ContractFormData) => {
    dispatch(addContract(data));
    navigate('/contracts');
  };

  const handleBlueprintSelect = (blueprint: Blueprint | null) => {
    if (blueprint) {
      setInitialData(blueprint.template);
      setSelectedBlueprintName(blueprint.name);
    }
    setStep('form');
  };

  const handleSkipBlueprint = () => {
    setInitialData(undefined);
    setSelectedBlueprintName(null);
    setStep('form');
  };

  const handleBackToBlueprints = () => {
    setStep('blueprint');
    setInitialData(undefined);
    setSelectedBlueprintName(null);
  };

  return (
    <div className="create-contract-page">
      <div className="page-header">
        <button 
          onClick={step === 'form' ? handleBackToBlueprints : () => navigate(-1)} 
          className="back-button"
        >
          <ArrowLeft size={20} />
          {step === 'form' ? 'Back to Blueprints' : 'Back'}
        </button>
        <h1 className="page-title">
          {step === 'blueprint' ? 'Create New Contract' : 'Contract Details'}
        </h1>
        <p className="page-subtitle">
          {step === 'blueprint' 
            ? 'Select a template to get started quickly'
            : selectedBlueprintName 
              ? `Using "${selectedBlueprintName}" template`
              : 'Fill in the details to create a new contract'
          }
        </p>
      </div>

      {step === 'blueprint' ? (
        <BlueprintSelector 
          onSelect={handleBlueprintSelect} 
          onSkip={handleSkipBlueprint}
        />
      ) : (
        <ContractForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
        />
      )}
    </div>
  );
};

export default CreateContract;
