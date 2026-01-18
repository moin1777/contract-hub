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
  X
} from 'lucide-react';
import type { Blueprint, BlueprintCategory } from '../../types/blueprint';
import { defaultBlueprints, blueprintCategories } from '../../types/blueprint';
import './BlueprintSelector.css';

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

const BlueprintSelector: React.FC<BlueprintSelectorProps> = ({ onSelect, onSkip }) => {
  const [selectedCategory, setSelectedCategory] = useState<BlueprintCategory | 'all'>('all');
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);

  const filteredBlueprints = selectedCategory === 'all'
    ? defaultBlueprints
    : defaultBlueprints.filter((bp) => bp.category === selectedCategory);

  const handleUseBlueprint = () => {
    if (selectedBlueprint) {
      onSelect(selectedBlueprint);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || FileText;
    return IconComponent;
  };

  return (
    <div className="blueprint-selector">
      <div className="blueprint-header">
        <div className="blueprint-header-content">
          <h2 className="blueprint-title">Choose a Blueprint</h2>
          <p className="blueprint-subtitle">
            Start with a pre-built template to create your contract faster
          </p>
        </div>
        <button className="skip-button" onClick={onSkip}>
          Start from scratch
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="category-tabs">
        <button
          className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {blueprintCategories.map((cat) => (
          <button
            key={cat.value}
            className={`category-tab ${selectedCategory === cat.value ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="blueprints-grid">
        {filteredBlueprints.map((blueprint) => {
          const Icon = getIcon(blueprint.icon);
          const isSelected = selectedBlueprint?.id === blueprint.id;
          
          return (
            <div
              key={blueprint.id}
              className={`blueprint-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedBlueprint(isSelected ? null : blueprint)}
            >
              <div 
                className="blueprint-icon"
                style={{ backgroundColor: `${blueprint.color}15`, color: blueprint.color }}
              >
                <Icon size={24} />
              </div>
              <div className="blueprint-info">
                <h3 className="blueprint-name">{blueprint.name}</h3>
                <p className="blueprint-description">{blueprint.description}</p>
              </div>
              {isSelected && (
                <div className="selected-indicator" style={{ backgroundColor: blueprint.color }}>
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
        <div className="blueprint-preview">
          <div className="preview-header">
            <h3>Template Preview</h3>
            <button className="close-preview" onClick={() => setSelectedBlueprint(null)}>
              <X size={18} />
            </button>
          </div>
          <div className="preview-content">
            <div className="preview-field">
              <span className="preview-label">Title</span>
              <span className="preview-value">{selectedBlueprint.template.title}</span>
            </div>
            <div className="preview-field">
              <span className="preview-label">Description</span>
              <span className="preview-value">{selectedBlueprint.template.description}</span>
            </div>
            {selectedBlueprint.template.value !== undefined && selectedBlueprint.template.value > 0 && (
              <div className="preview-field">
                <span className="preview-label">Default Value</span>
                <span className="preview-value">
                  ${selectedBlueprint.template.value.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          <button className="use-blueprint-btn" onClick={handleUseBlueprint}>
            Use this Blueprint
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BlueprintSelector;
