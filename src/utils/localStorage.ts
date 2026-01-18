import type { Contract } from '../types/contract';

const STORAGE_KEY = 'contracts';

// Demo contracts that will be added if no contracts exist
const demoContracts: Contract[] = [
  {
    id: 'demo-1',
    title: 'Web Development Agreement',
    clientName: 'Acme Corporation',
    description: 'Full-stack web development services for e-commerce platform including frontend, backend, and database design.',
    status: 'sent',
    startDate: '2026-01-15',
    endDate: '2026-06-15',
    value: 45000,
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-12T14:30:00.000Z',
    blueprintName: 'Service Agreement',
    customFields: [
      { fieldId: 'demo-field-1', label: 'Project Manager', type: 'text', value: 'John Smith' },
      { fieldId: 'demo-field-2', label: 'Deadline', type: 'date', value: '2026-06-15' },
    ],
  },
  {
    id: 'demo-2',
    title: 'Employment Contract - Senior Developer',
    clientName: 'Sarah Johnson',
    description: 'Full-time employment contract for Senior Software Developer position with competitive benefits package.',
    status: 'signed',
    startDate: '2026-02-01',
    endDate: '2027-01-31',
    value: 120000,
    createdAt: '2026-01-05T09:00:00.000Z',
    updatedAt: '2026-01-15T16:45:00.000Z',
    blueprintName: 'Employment Contract',
    customFields: [
      { fieldId: 'demo-field-3', label: 'Position', type: 'text', value: 'Senior Software Developer' },
      { fieldId: 'demo-field-4', label: 'Department', type: 'text', value: 'Engineering' },
      { fieldId: 'demo-field-5', label: 'Employee Signature', type: 'signature', value: 'Sarah Johnson' },
    ],
  },
  {
    id: 'demo-3',
    title: 'Software License Agreement',
    clientName: 'TechStart Inc.',
    description: 'Enterprise software licensing agreement with annual subscription and premium support services.',
    status: 'locked',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    value: 75000,
    createdAt: '2025-12-20T11:00:00.000Z',
    updatedAt: '2026-01-02T10:00:00.000Z',
    blueprintName: 'Sales Agreement',
    customFields: [
      { fieldId: 'demo-field-6', label: 'License Type', type: 'text', value: 'Enterprise' },
      { fieldId: 'demo-field-7', label: 'Users', type: 'text', value: '500' },
      { fieldId: 'demo-field-8', label: 'Auto-Renewal', type: 'checkbox', value: true },
    ],
  },
];

export const loadContractsFromStorage = (): Contract[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const contracts = JSON.parse(data);
      if (contracts.length > 0) {
        return contracts;
      }
    }
    // No contracts found, save and return demo contracts
    saveContractsToStorage(demoContracts);
    return demoContracts;
  } catch (error) {
    console.error('Error loading contracts from localStorage:', error);
    return demoContracts;
  }
};

export const saveContractsToStorage = (contracts: Contract[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  } catch (error) {
    console.error('Error saving contracts to localStorage:', error);
  }
};
