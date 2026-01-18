import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Layers,
} from 'lucide-react';
import type { Blueprint, BlueprintCategory } from '../../types/blueprint';
import { defaultBlueprints, blueprintCategories } from '../../types/blueprint';
import './Blueprints.css';

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

const Blueprints: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<BlueprintCategory | 'all'>('all');

  const filteredBlueprints =
    selectedCategory === 'all'
      ? defaultBlueprints
      : defaultBlueprints.filter((bp) => bp.category === selectedCategory);

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || FileText;
  };

  const handleUseBlueprint = (blueprint: Blueprint) => {
    // Navigate to create page with blueprint data via state
    navigate('/contracts/new', { state: { blueprint } });
  };

  return (
    <div className="blueprints-page">
      <div className="page-header">
        <div className="header-icon">
          <Layers size={28} />
        </div>
        <div>
          <h1 className="page-title">Contract Blueprints</h1>
          <p className="page-subtitle">
            Pre-built templates to help you create contracts faster
          </p>
        </div>
      </div>

      <div className="category-filter">
        <button
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Templates
          <span className="category-count">{defaultBlueprints.length}</span>
        </button>
        {blueprintCategories.map((cat) => {
          const count = defaultBlueprints.filter((bp) => bp.category === cat.value).length;
          return (
            <button
              key={cat.value}
              className={`category-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
              <span className="category-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="blueprints-grid">
        {filteredBlueprints.map((blueprint) => {
          const Icon = getIcon(blueprint.icon);
          return (
            <div key={blueprint.id} className="blueprint-card">
              <div className="card-header">
                <div
                  className="blueprint-icon"
                  style={{ backgroundColor: `${blueprint.color}15`, color: blueprint.color }}
                >
                  <Icon size={24} />
                </div>
                <span className="category-badge">{blueprint.category}</span>
              </div>
              <div className="card-content">
                <h3 className="blueprint-name">{blueprint.name}</h3>
                <p className="blueprint-description">{blueprint.description}</p>
                {blueprint.template.value !== undefined && blueprint.template.value > 0 && (
                  <div className="template-value">
                    Default value: ${blueprint.template.value.toLocaleString()}
                  </div>
                )}
              </div>
              <button
                className="use-btn"
                onClick={() => handleUseBlueprint(blueprint)}
                style={{ 
                  '--btn-color': blueprint.color,
                  '--btn-color-hover': blueprint.color,
                } as React.CSSProperties}
              >
                Use Template
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Blueprints;
