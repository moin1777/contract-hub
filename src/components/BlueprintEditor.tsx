import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  GripVertical,
  Type,
  Calendar,
  PenTool,
  CheckSquare,
  Save,
} from 'lucide-react';
import type { Blueprint, BlueprintField, BlueprintFieldType, BlueprintCategory } from '../types/blueprint';
import { blueprintCategories } from '../types/blueprint';

interface BlueprintEditorProps {
  blueprint?: Blueprint | null;
  onSave: (blueprint: Omit<Blueprint, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>) => void;
  onCancel: () => void;
}

const fieldTypeIcons: Record<BlueprintFieldType, React.ReactNode> = {
  text: <Type size={16} />,
  date: <Calendar size={16} />,
  signature: <PenTool size={16} />,
  checkbox: <CheckSquare size={16} />,
};

const fieldTypeLabels: Record<BlueprintFieldType, string> = {
  text: 'Text',
  date: 'Date',
  signature: 'Signature',
  checkbox: 'Checkbox',
};

const colorOptions = [
  '#6366f1', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#0ea5e9', '#14b8a6',
  '#ef4444', '#84cc16',
];

const iconOptions = [
  'Briefcase', 'Users', 'ShoppingCart', 'Lock',
  'Handshake', 'Home', 'MessageSquare', 'UserCheck', 'FileText',
];

const BlueprintEditor: React.FC<BlueprintEditorProps> = ({
  blueprint,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(blueprint?.name || '');
  const [description, setDescription] = useState(blueprint?.description || '');
  const [category, setCategory] = useState<BlueprintCategory>(blueprint?.category || 'other');
  const [color, setColor] = useState(blueprint?.color || '#6366f1');
  const [icon, setIcon] = useState(blueprint?.icon || 'FileText');
  const [templateTitle, setTemplateTitle] = useState(blueprint?.template.title || '');
  const [templateDescription, setTemplateDescription] = useState(blueprint?.template.description || '');
  const [templateValue, setTemplateValue] = useState(blueprint?.template.value || 0);
  const [fields, setFields] = useState<BlueprintField[]>(blueprint?.fields || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (blueprint) {
      setName(blueprint.name);
      setDescription(blueprint.description);
      setCategory(blueprint.category);
      setColor(blueprint.color);
      setIcon(blueprint.icon);
      setTemplateTitle(blueprint.template.title || '');
      setTemplateDescription(blueprint.template.description || '');
      setTemplateValue(blueprint.template.value || 0);
      setFields(blueprint.fields || []);
    }
  }, [blueprint]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!templateTitle.trim()) newErrors.templateTitle = 'Template title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      name,
      description,
      category,
      color,
      icon,
      template: {
        title: templateTitle,
        description: templateDescription,
        value: templateValue,
        status: 'created',
      },
      fields,
    });
  };

  const addField = (type: BlueprintFieldType) => {
    const newField: BlueprintField = {
      id: `temp-${Date.now()}`,
      type,
      label: `New ${fieldTypeLabels[type]} Field`,
      required: false,
      position: { x: 0, y: fields.length },
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<BlueprintField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = fields.findIndex((f) => f.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === fields.length - 1)
    ) {
      return;
    }

    const newFields = [...fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    setFields(newFields);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {blueprint ? 'Edit Blueprint' : 'Create New Blueprint'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Blueprint Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.name ? 'border-red-300' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="e.g., Custom Service Agreement"
              />
              {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BlueprintCategory)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {blueprintCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={2}
                placeholder="Brief description of this blueprint"
              />
            </div>
          </div>

          {/* Color & Icon Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Color</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Icon</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {iconOptions.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Template Defaults */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Template Defaults</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Default Title *</label>
                <input
                  type="text"
                  value={templateTitle}
                  onChange={(e) => setTemplateTitle(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.templateTitle ? 'border-red-300' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Default contract title"
                />
                {errors.templateTitle && (
                  <span className="text-xs text-red-500">{errors.templateTitle}</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Default Value ($)</label>
                <input
                  type="number"
                  value={templateValue}
                  onChange={(e) => setTemplateValue(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Default Description</label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={2}
                  placeholder="Default contract description"
                />
              </div>
            </div>
          </div>

          {/* Custom Fields */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Custom Fields</h3>
              <div className="flex gap-2">
                {(['text', 'date', 'signature', 'checkbox'] as BlueprintFieldType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addField(type)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {fieldTypeIcons[type]}
                    {fieldTypeLabels[type]}
                  </button>
                ))}
              </div>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                <Plus className="mx-auto mb-2 text-gray-400" size={24} />
                <p>No fields added yet. Click a field type above to add one.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="text-gray-400 cursor-move">
                      <GripVertical size={18} />
                    </div>

                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {fieldTypeIcons[field.type]}
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Field label"
                      />

                      <select
                        value={field.type}
                        onChange={(e) =>
                          updateField(field.id, { type: e.target.value as BlueprintFieldType })
                        }
                        className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      >
                        {(['text', 'date', 'signature', 'checkbox'] as BlueprintFieldType[]).map(
                          (type) => (
                            <option key={type} value={type}>
                              {fieldTypeLabels[type]}
                            </option>
                          )
                        )}
                      </select>

                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        Required
                      </label>
                    </div>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveField(field.id, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded text-gray-400 hover:bg-gray-200 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveField(field.id, 'down')}
                        disabled={index === fields.length - 1}
                        className="p-1.5 rounded text-gray-400 hover:bg-gray-200 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeField(field.id)}
                        className="p-1.5 rounded text-red-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            <Save size={18} />
            {blueprint ? 'Save Changes' : 'Create Blueprint'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlueprintEditor;
