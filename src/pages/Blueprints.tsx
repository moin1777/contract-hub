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
import type { Blueprint, BlueprintCategory } from '../types/blueprint';
import { defaultBlueprints, blueprintCategories } from '../types/blueprint';

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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Layers size={28} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contract Blueprints</h1>
          <p className="text-gray-500">
            Pre-built templates to help you create contracts faster
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All Templates
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            selectedCategory === 'all' ? 'bg-indigo-500' : 'bg-gray-200'
          }`}>
            {defaultBlueprints.length}
          </span>
        </button>
        {blueprintCategories.map((cat) => {
          const count = defaultBlueprints.filter((bp) => bp.category === cat.value).length;
          return (
            <button
              key={cat.value}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                selectedCategory === cat.value ? 'bg-indigo-500' : 'bg-gray-200'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBlueprints.map((blueprint) => {
          const Icon = getIcon(blueprint.icon);
          return (
            <div
              key={blueprint.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${blueprint.color}15`, color: blueprint.color }}
                >
                  <Icon size={24} />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                  {blueprint.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{blueprint.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{blueprint.description}</p>
                {blueprint.template.value !== undefined && blueprint.template.value > 0 && (
                  <div className="text-xs text-gray-400 mb-3">
                    Default value: ${blueprint.template.value.toLocaleString()}
                  </div>
                )}
              </div>
              <div className="px-4 pb-4">
                <button
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors text-white"
                  onClick={() => handleUseBlueprint(blueprint)}
                  style={{ backgroundColor: blueprint.color }}
                >
                  Use Template
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Blueprints;
