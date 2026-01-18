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
  Plus,
  Edit2,
  Trash2,
  Copy,
  MoreVertical,
  Type,
  Calendar,
  CheckSquare,
  PenTool,
} from 'lucide-react';
import type { Blueprint, BlueprintCategory } from '../types/blueprint';
import { blueprintCategories } from '../types/blueprint';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteBlueprint, duplicateBlueprint, setEditingBlueprint, addBlueprint, updateBlueprint } from '../store/blueprintSlice';
import BlueprintEditor from '../components/BlueprintEditor';

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

const fieldTypeIcons: Record<string, React.FC<{ size?: number }>> = {
  text: Type,
  date: Calendar,
  checkbox: CheckSquare,
  signature: PenTool,
};

const Blueprints: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const blueprints = useAppSelector((state) => state.blueprints.blueprints);
  const editingBlueprint = useAppSelector((state) => state.blueprints.editingBlueprint);
  
  const [selectedCategory, setSelectedCategory] = useState<BlueprintCategory | 'all'>('all');
  const [showEditor, setShowEditor] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredBlueprints =
    selectedCategory === 'all'
      ? blueprints
      : blueprints.filter((bp) => bp.category === selectedCategory);

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || FileText;
  };

  const handleUseBlueprint = (blueprint: Blueprint) => {
    navigate('/contracts/new', { state: { blueprint } });
  };

  const handleCreateNew = () => {
    dispatch(setEditingBlueprint(null));
    setShowEditor(true);
  };

  const handleEdit = (blueprint: Blueprint) => {
    dispatch(setEditingBlueprint(blueprint));
    setShowEditor(true);
    setOpenMenuId(null);
  };

  const handleDuplicate = (blueprint: Blueprint) => {
    dispatch(duplicateBlueprint(blueprint.id));
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteBlueprint(id));
    setDeleteConfirmId(null);
    setOpenMenuId(null);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    dispatch(setEditingBlueprint(null));
  };

  const handleSaveBlueprint = (blueprintData: Omit<Blueprint, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>) => {
    if (editingBlueprint) {
      dispatch(updateBlueprint({
        id: editingBlueprint.id,
        updates: blueprintData,
      }));
    } else {
      dispatch(addBlueprint(blueprintData));
    }
    handleCloseEditor();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Create Blueprint
        </button>
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
            {blueprints.length}
          </span>
        </button>
        {blueprintCategories.map((cat) => {
          const count = blueprints.filter((bp) => bp.category === cat.value).length;
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
          const isCustom = blueprint.isCustom;
          return (
            <div
              key={blueprint.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group relative"
            >
              {/* Actions Menu */}
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => setOpenMenuId(openMenuId === blueprint.id ? null : blueprint.id)}
                  className="p-1.5 rounded-lg bg-white/80 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical size={16} className="text-gray-600" />
                </button>
                {openMenuId === blueprint.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <button
                        onClick={() => handleEdit(blueprint)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDuplicate(blueprint)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <Copy size={14} />
                        Duplicate
                      </button>
                      {isCustom && (
                        <button
                          onClick={() => setDeleteConfirmId(blueprint.id)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${blueprint.color}15`, color: blueprint.color }}
                >
                  <Icon size={24} />
                </div>
                <div className="flex items-center gap-2">
                  {isCustom && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-600">
                      Custom
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                    {blueprint.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{blueprint.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{blueprint.description}</p>
                
                {/* Show fields count */}
                {blueprint.fields && blueprint.fields.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {blueprint.fields.slice(0, 4).map((field) => {
                      const FieldIcon = fieldTypeIcons[field.type] || Type;
                      return (
                        <span
                          key={field.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                          title={field.label}
                        >
                          <FieldIcon size={10} />
                          {field.label.length > 10 ? field.label.slice(0, 10) + '...' : field.label}
                        </span>
                      );
                    })}
                    {blueprint.fields.length > 4 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                        +{blueprint.fields.length - 4} more
                      </span>
                    )}
                  </div>
                )}

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

      {filteredBlueprints.length === 0 && (
        <div className="text-center py-12">
          <Layers size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blueprints found</h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory === 'all'
              ? 'Get started by creating your first blueprint'
              : `No blueprints in the "${selectedCategory}" category`}
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            Create Blueprint
          </button>
        </div>
      )}

      {/* Blueprint Editor Modal */}
      {showEditor && (
        <BlueprintEditor
          blueprint={editingBlueprint}
          onSave={handleSaveBlueprint}
          onCancel={handleCloseEditor}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Blueprint</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this blueprint? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blueprints;
