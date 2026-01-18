import React, { useState, useEffect } from 'react';
import type { ContractFormData, ContractStatus, Contract } from '../../types/contract';
import './ContractForm.css';

interface ContractFormProps {
  initialData?: Contract | Partial<ContractFormData>;
  onSubmit: (data: ContractFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const ContractForm: React.FC<ContractFormProps> = ({
  initialData,
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
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContractFormData, string>>>({});

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
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContractFormData, string>> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const statuses: ContractStatus[] = ['draft', 'active', 'expired', 'terminated'];

  return (
    <form className="contract-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="title">Contract Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter contract title"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="clientName">Client Name *</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="Enter client name"
            className={errors.clientName ? 'error' : ''}
          />
          {errors.clientName && <span className="error-message">{errors.clientName}</span>}
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter contract description"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="value">Contract Value ($)</label>
          <input
            type="number"
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="100"
            className={errors.value ? 'error' : ''}
          />
          {errors.value && <span className="error-message">{errors.value}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date *</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={errors.startDate ? 'error' : ''}
          />
          {errors.startDate && <span className="error-message">{errors.startDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date *</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={errors.endDate ? 'error' : ''}
          />
          {errors.endDate && <span className="error-message">{errors.endDate}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update Contract' : 'Create Contract'}
        </button>
      </div>
    </form>
  );
};

export default ContractForm;
