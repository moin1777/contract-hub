import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { addContract } from '../store/contractSlice';
import ContractForm from '../components/ContractForm';
import BlueprintSelector from '../components/BlueprintSelector';
import type { ContractFormData } from '../types/contract';
import type { Blueprint, BlueprintField } from '../types/blueprint';

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
  const [blueprintFields, setBlueprintFields] = useState<BlueprintField[]>(
    stateBlueprint?.fields || []
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
    dispatch(addContract({
      ...data,
      blueprintName: selectedBlueprintName || undefined,
    }));
    navigate('/contracts');
  };

  const handleBlueprintSelect = (blueprint: Blueprint | null) => {
    if (blueprint) {
      setInitialData(blueprint.template);
      setSelectedBlueprintName(blueprint.name);
      setBlueprintFields(blueprint.fields || []);
    }
    setStep('form');
  };

  const handleSkipBlueprint = () => {
    setInitialData(undefined);
    setSelectedBlueprintName(null);
    setBlueprintFields([]);
    setStep('form');
  };

  const handleBackToBlueprints = () => {
    setStep('blueprint');
    setInitialData(undefined);
    setSelectedBlueprintName(null);
    setBlueprintFields([]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <button 
          onClick={step === 'form' ? handleBackToBlueprints : () => navigate(-1)} 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
          {step === 'form' ? 'Back to Blueprints' : 'Back'}
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {step === 'blueprint' ? 'Create New Contract' : 'Contract Details'}
        </h1>
        <p className="text-gray-500">
          {step === 'blueprint' 
            ? 'Select a template to get started quickly'
            : selectedBlueprintName 
              ? `Using "${selectedBlueprintName}" template`
              : 'Fill in the details to create a new contract'
          }
        </p>
      </div>

      {step === 'blueprint' ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <BlueprintSelector 
            onSelect={handleBlueprintSelect} 
            onSkip={handleSkipBlueprint}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <ContractForm
            initialData={initialData}
            blueprintFields={blueprintFields}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
          />
        </div>
      )}
    </div>
  );
};

export default CreateContract;
