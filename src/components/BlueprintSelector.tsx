import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  ShoppingCart, 
  Lock, 
  Handshake, 
  Home, 
  MessageSquare, 
  UserCheck,
  FileText,
  ArrowRight,
  X,
  Type,
  Calendar,
  CheckSquare,
  PenTool,
  Edit2,
} from 'lucide-react';
import type { Blueprint, BlueprintCategory } from '../types/blueprint';
import { blueprintCategories } from '../types/blueprint';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateBlueprint, addBlueprint } from '../store/blueprintSlice';
import BlueprintEditor from './BlueprintEditor';

interface BlueprintSelectorProps {
  onSelect: (blueprint: Blueprint | null) => void;
  onSkip: () => void;
}

const iconMap: Record<string, React.FC<{ size?: number }>> = {
  Briefcase,
  Users,
  ShoppingCart,
  Lock,
  Handshake,
  Home,
  MessageSquare,
  UserCheck,
  FileText,
};

const fieldTypeIcons: Record<string, React.FC<{ size?: number; className?: string }>> = {
  text: Type,
  date: Calendar,
  checkbox: CheckSquare,
  signature: PenTool,
};

const BlueprintSelector: React.FC<BlueprintSelectorProps> = ({ onSelect, onSkip }) => {
  const dispatch = useAppDispatch();
  const blueprints = useAppSelector((state) => state.blueprints.blueprints);
  const [selectedCategory, setSelectedCategory] = useState<BlueprintCategory | 'all'>('all');
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const filteredBlueprints = selectedCategory === 'all'
    ? blueprints
    : blueprints.filter((bp) => bp.category === selectedCategory);

  const handleUseBlueprint = () => {
    if (selectedBlueprint) {
      onSelect(selectedBlueprint);
    }
  };

  const handleEditBlueprint = () => {
    setShowEditor(true);
  };

  const handleSaveBlueprint = (blueprintData: Omit<Blueprint, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>) => {
    if (selectedBlueprint) {
      // Update existing blueprint or create as custom copy
      if (selectedBlueprint.isCustom) {
        dispatch(updateBlueprint({
          id: selectedBlueprint.id,
          updates: blueprintData,
        }));
        // Update selected blueprint with new data
        setSelectedBlueprint({
          ...selectedBlueprint,
          ...blueprintData,
        });
      } else {
        // Create a custom copy of the default blueprint
        dispatch(addBlueprint(blueprintData));
        // Find the newly created blueprint (it will be the last custom one)
        // We'll update the selection after the state updates
      }
    }
    setShowEditor(false);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || FileText;
    return IconComponent;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Choose a Blueprint</h2>
          <p className="text-gray-500 mt-1">
            Start with a pre-built template to create your contract faster
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
          onClick={onSkip}
        >
          Start from scratch
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {blueprintCategories.map((cat) => (
          <button
            key={cat.value}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === cat.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBlueprints.map((blueprint) => {
          const Icon = getIcon(blueprint.icon);
          const isSelected = selectedBlueprint?.id === blueprint.id;
          
          return (
            <div
              key={blueprint.id}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedBlueprint(isSelected ? null : blueprint)}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${blueprint.color}15`, color: blueprint.color }}
              >
                <Icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{blueprint.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{blueprint.description}</p>
              </div>
              {isSelected && (
                <div
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: blueprint.color }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedBlueprint && (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Template Preview</h3>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
              onClick={() => setSelectedBlueprint(null)}
            >
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3 mb-4">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</span>
              <p className="text-gray-900">{selectedBlueprint.template.title}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</span>
              <p className="text-gray-900">{selectedBlueprint.template.description}</p>
            </div>
            {selectedBlueprint.template.value !== undefined && selectedBlueprint.template.value > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Default Value</span>
                <p className="text-gray-900">
                  ${selectedBlueprint.template.value.toLocaleString()}
                </p>
              </div>
            )}
            {selectedBlueprint.fields && selectedBlueprint.fields.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Custom Fields</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedBlueprint.fields.map((field) => {
                    const FieldIcon = fieldTypeIcons[field.type] || Type;
                    return (
                      <span
                        key={field.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm bg-white border border-gray-200"
                      >
                        <FieldIcon size={14} className="text-gray-400" />
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              onClick={handleEditBlueprint}
            >
              <Edit2 size={18} />
              Edit this Blueprint
            </button>
            <button
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              onClick={handleUseBlueprint}
            >
              Use this Blueprint
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Blueprint Editor Modal */}
      {showEditor && selectedBlueprint && (
        <BlueprintEditor
          blueprint={selectedBlueprint}
          onSave={handleSaveBlueprint}
          onCancel={handleCloseEditor}
        />
      )}
    </div>
  );
};

export default BlueprintSelector;
