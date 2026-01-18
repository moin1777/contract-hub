import React, { useState, useEffect } from 'react';
import { Type, Calendar, CheckSquare, PenTool } from 'lucide-react';
import type { ContractFormData, ContractStatus, Contract, CustomFieldValue } from '../types/contract';
import type { BlueprintField } from '../types/blueprint';

interface ContractFormProps {
  initialData?: Contract | Partial<ContractFormData>;
  blueprintFields?: BlueprintField[];
  onSubmit: (data: ContractFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const fieldTypeIcons: Record<string, React.FC<{ size?: number; className?: string }>> = {
  text: Type,
  date: Calendar,
  checkbox: CheckSquare,
  signature: PenTool,
};

const ContractForm: React.FC<ContractFormProps> = ({
  initialData,
  blueprintFields = [],
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<ContractFormData>({
    clientName: '',
    title: '',
    description: '',
    status: 'draft',
    startDate: '',
    endDate: '',
    value: 0,
    customFields: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContractFormData, string>>>({});
  const [customFieldErrors, setCustomFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        clientName: initialData.clientName || '',
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'draft',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        value: initialData.value || 0,
        customFields: initialData.customFields || [],
      });
    }
  }, [initialData]);

  // Initialize custom fields when blueprint fields are provided
  useEffect(() => {
    if (blueprintFields.length > 0 && (!formData.customFields || formData.customFields.length === 0)) {
      const initialCustomFields: CustomFieldValue[] = blueprintFields.map((field) => ({
        fieldId: field.id,
        label: field.label,
        type: field.type,
        value: field.type === 'checkbox' ? false : '',
      }));
      setFormData((prev) => ({ ...prev, customFields: initialCustomFields }));
    }
  }, [blueprintFields, formData.customFields]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContractFormData, string>> = {};
    const newCustomFieldErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (formData.value < 0) {
      newErrors.value = 'Value must be positive';
    }

    // Validate required custom fields
    blueprintFields.forEach((field) => {
      if (field.required) {
        const customField = formData.customFields?.find((cf) => cf.fieldId === field.id);
        if (!customField) {
          newCustomFieldErrors[field.id] = `${field.label} is required`;
        } else if (field.type === 'text' || field.type === 'date' || field.type === 'signature') {
          if (!customField.value || (typeof customField.value === 'string' && !customField.value.trim())) {
            newCustomFieldErrors[field.id] = `${field.label} is required`;
          }
        }
      }
    });

    setErrors(newErrors);
    setCustomFieldErrors(newCustomFieldErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(newCustomFieldErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    if (errors[name as keyof ContractFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields?.map((cf) =>
        cf.fieldId === fieldId ? { ...cf, value } : cf
      ),
    }));
    if (customFieldErrors[fieldId]) {
      setCustomFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldId];
        return updated;
      });
    }
  };

  const statuses: ContractStatus[] = ['draft', 'active', 'expired', 'terminated'];

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2.5 rounded-lg border ${
      hasError
        ? 'border-red-300 focus:ring-red-500'
        : 'border-gray-200 focus:ring-indigo-500'
    } bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all`;

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            Contract Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter contract title"
            className={inputClass(!!errors.title)}
          />
          {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="clientName" className="text-sm font-medium text-gray-700">
            Client Name *
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="Enter client name"
            className={inputClass(!!errors.clientName)}
          />
          {errors.clientName && <span className="text-xs text-red-500">{errors.clientName}</span>}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter contract description"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="status" className="text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="value" className="text-sm font-medium text-gray-700">
            Contract Value ($)
          </label>
          <input
            type="number"
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="100"
            className={inputClass(!!errors.value)}
          />
          {errors.value && <span className="text-xs text-red-500">{errors.value}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={inputClass(!!errors.startDate)}
          />
          {errors.startDate && <span className="text-xs text-red-500">{errors.startDate}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={inputClass(!!errors.endDate)}
          />
          {errors.endDate && <span className="text-xs text-red-500">{errors.endDate}</span>}
        </div>
      </div>

      {/* Custom Fields Section from Blueprint */}
      {blueprintFields.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Template Fields</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blueprintFields.map((field) => {
              const FieldIcon = fieldTypeIcons[field.type] || Type;
              const customField = formData.customFields?.find((cf) => cf.fieldId === field.id);
              const hasError = !!customFieldErrors[field.id];

              return (
                <div key={field.id} className={`flex flex-col gap-2 ${field.type === 'signature' ? 'md:col-span-2' : ''}`}>
                  <label
                    htmlFor={`custom-${field.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <FieldIcon size={14} className="text-gray-400" />
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      id={`custom-${field.id}`}
                      value={(customField?.value as string) || ''}
                      onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className={inputClass(hasError)}
                    />
                  )}

                  {field.type === 'date' && (
                    <input
                      type="date"
                      id={`custom-${field.id}`}
                      value={(customField?.value as string) || ''}
                      onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                      className={inputClass(hasError)}
                    />
                  )}

                  {field.type === 'checkbox' && (
                    <label className="inline-flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        id={`custom-${field.id}`}
                        checked={(customField?.value as boolean) || false}
                        onChange={(e) => handleCustomFieldChange(field.id, e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-600">Check if applicable</span>
                    </label>
                  )}

                  {field.type === 'signature' && (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        id={`custom-${field.id}`}
                        value={(customField?.value as string) || ''}
                        onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                        placeholder="Type your full name as signature"
                        className={inputClass(hasError)}
                      />
                      {customField?.value && typeof customField.value === 'string' && customField.value.trim() && (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Signature Preview:</p>
                          <p className="text-xl italic font-serif text-gray-800">{customField.value}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {hasError && (
                    <span className="text-xs text-red-500">{customFieldErrors[field.id]}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
        >
          {isEditing ? 'Update Contract' : 'Create Contract'}
        </button>
      </div>
    </form>
  );
};

export default ContractForm;
