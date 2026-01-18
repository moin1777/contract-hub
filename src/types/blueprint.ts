import type { ContractFormData, ContractStatus } from './contract';

// Field types for blueprint configuration
export type BlueprintFieldType = 'text' | 'date' | 'signature' | 'checkbox';

export interface BlueprintField {
  id: string;
  type: BlueprintFieldType;
  label: string;
  required: boolean;
  position: {
    x: number;
    y: number;
  };
  placeholder?: string;
  defaultValue?: string | boolean;
}

export interface Blueprint {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BlueprintCategory;
  template: Partial<ContractFormData>;
  color: string;
  fields: BlueprintField[];
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type BlueprintCategory = 'service' | 'employment' | 'sales' | 'partnership' | 'nda' | 'other';

export const blueprintCategories: { value: BlueprintCategory; label: string }[] = [
  { value: 'service', label: 'Service' },
  { value: 'employment', label: 'Employment' },
  { value: 'sales', label: 'Sales' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'nda', label: 'NDA' },
  { value: 'other', label: 'Other' },
];

export const defaultBlueprints: Blueprint[] = [
  {
    id: 'bp-service-agreement',
    name: 'Service Agreement',
    description: 'Standard service agreement for professional services, consulting, or freelance work.',
    icon: 'Briefcase',
    category: 'service',
    color: '#6366f1',
    template: {
      title: 'Service Agreement',
      description: 'This Service Agreement outlines the terms and conditions under which services will be provided. It covers scope of work, deliverables, timelines, and payment terms.',
      status: 'draft' as ContractStatus,
      value: 5000,
    },
    fields: [
      { id: 'f1', type: 'text', label: 'Service Provider Name', required: true, position: { x: 0, y: 0 } },
      { id: 'f2', type: 'text', label: 'Scope of Work', required: true, position: { x: 0, y: 1 } },
      { id: 'f3', type: 'date', label: 'Service Start Date', required: true, position: { x: 0, y: 2 } },
      { id: 'f4', type: 'signature', label: 'Provider Signature', required: true, position: { x: 0, y: 3 } },
    ],
  },
  {
    id: 'bp-employment-contract',
    name: 'Employment Contract',
    description: 'Full-time or part-time employment agreement with standard terms and conditions.',
    icon: 'Users',
    category: 'employment',
    color: '#10b981',
    template: {
      title: 'Employment Contract',
      description: 'This Employment Contract establishes the terms of employment including job responsibilities, compensation, benefits, and termination conditions.',
      status: 'draft' as ContractStatus,
      value: 75000,
    },
    fields: [
      { id: 'f1', type: 'text', label: 'Employee Name', required: true, position: { x: 0, y: 0 } },
      { id: 'f2', type: 'text', label: 'Job Title', required: true, position: { x: 0, y: 1 } },
      { id: 'f3', type: 'date', label: 'Start Date', required: true, position: { x: 0, y: 2 } },
      { id: 'f4', type: 'checkbox', label: 'Full-time Position', required: false, position: { x: 0, y: 3 }, defaultValue: true },
      { id: 'f5', type: 'signature', label: 'Employee Signature', required: true, position: { x: 0, y: 4 } },
    ],
  },
  {
    id: 'bp-sales-agreement',
    name: 'Sales Agreement',
    description: 'Agreement for the sale of goods or products with delivery and payment terms.',
    icon: 'ShoppingCart',
    category: 'sales',
    color: '#f59e0b',
    template: {
      title: 'Sales Agreement',
      description: 'This Sales Agreement governs the sale and purchase of goods, including pricing, delivery schedules, warranties, and return policies.',
      status: 'draft' as ContractStatus,
      value: 10000,
    },
    fields: [
      { id: 'f1', type: 'text', label: 'Buyer Name', required: true, position: { x: 0, y: 0 } },
      { id: 'f2', type: 'text', label: 'Product/Service Description', required: true, position: { x: 0, y: 1 } },
      { id: 'f3', type: 'date', label: 'Delivery Date', required: true, position: { x: 0, y: 2 } },
      { id: 'f4', type: 'signature', label: 'Buyer Signature', required: true, position: { x: 0, y: 3 } },
    ],
  },
  {
    id: 'bp-nda',
    name: 'Non-Disclosure Agreement',
    description: 'Protect confidential information shared between parties.',
    icon: 'Lock',
    category: 'nda',
    color: '#8b5cf6',
    template: {
      title: 'Non-Disclosure Agreement (NDA)',
      description: 'This Non-Disclosure Agreement protects confidential and proprietary information shared between the parties. It defines what constitutes confidential information and the obligations of the receiving party.',
      status: 'draft' as ContractStatus,
      value: 0,
    },
    fields: [
      { id: 'f1', type: 'text', label: 'Disclosing Party', required: true, position: { x: 0, y: 0 } },
      { id: 'f2', type: 'text', label: 'Receiving Party', required: true, position: { x: 0, y: 1 } },
      { id: 'f3', type: 'date', label: 'Effective Date', required: true, position: { x: 0, y: 2 } },
      { id: 'f4', type: 'checkbox', label: 'Mutual NDA', required: false, position: { x: 0, y: 3 }, defaultValue: false },
      { id: 'f5', type: 'signature', label: 'Party 1 Signature', required: true, position: { x: 0, y: 4 } },
      { id: 'f6', type: 'signature', label: 'Party 2 Signature', required: true, position: { x: 1, y: 4 } },
    ],
  },
  {
    id: 'bp-partnership',
    name: 'Partnership Agreement',
    description: 'Define roles, responsibilities, and profit-sharing between business partners.',
    icon: 'Handshake',
    category: 'partnership',
    color: '#ec4899',
    template: {
      title: 'Partnership Agreement',
      description: 'This Partnership Agreement establishes the terms of the business partnership including capital contributions, profit distribution, decision-making authority, and dissolution procedures.',
      status: 'draft' as ContractStatus,
      value: 50000,
    },
    fields: [
      { id: 'f1', type: 'text', label: 'Partner 1 Name', required: true, position: { x: 0, y: 0 } },
      { id: 'f2', type: 'text', label: 'Partner 2 Name', required: true, position: { x: 1, y: 0 } },
      { id: 'f3', type: 'text', label: 'Partnership Name', required: true, position: { x: 0, y: 1 } },
      { id: 'f4', type: 'date', label: 'Effective Date', required: true, position: { x: 0, y: 2 } },
      { id: 'f5', type: 'signature', label: 'Partner 1 Signature', required: true, position: { x: 0, y: 3 } },
      { id: 'f6', type: 'signature', label: 'Partner 2 Signature', required: true, position: { x: 1, y: 3 } },
    ],
  },
  {
    id: 'bp-lease-agreement',
    name: 'Lease Agreement',
    description: 'Property or equipment rental agreement with terms and conditions.',
    icon: 'Home',
    category: 'other',
    color: '#06b6d4',
    template: {
      title: 'Lease Agreement',
      description: 'This Lease Agreement outlines the terms for renting property or equipment, including rental period, payment schedule, maintenance responsibilities, and termination clauses.',
      status: 'draft' as ContractStatus,
      value: 24000,
    },
    fields: [
      { id: 'f1', type: 'text', label: 'Landlord Name', required: true, position: { x: 0, y: 0 } },
      { id: 'f2', type: 'text', label: 'Tenant Name', required: true, position: { x: 0, y: 1 } },
      { id: 'f3', type: 'text', label: 'Property Address', required: true, position: { x: 0, y: 2 } },
      { id: 'f4', type: 'date', label: 'Lease Start Date', required: true, position: { x: 0, y: 3 } },
      { id: 'f5', type: 'date', label: 'Lease End Date', required: true, position: { x: 1, y: 3 } },
      { id: 'f6', type: 'signature', label: 'Landlord Signature', required: true, position: { x: 0, y: 4 } },
      { id: 'f7', type: 'signature', label: 'Tenant Signature', required: true, position: { x: 1, y: 4 } },
    ],
  },
  {
    id: 'bp-consulting',
    name: 'Consulting Agreement',
    description: 'Professional consulting services with defined scope and deliverables.',
    icon: 'MessageSquare',
    category: 'service',
    color: '#0ea5e9',
    template: {
      title: 'Consulting Agreement',
      description: 'This Consulting Agreement defines the scope of consulting services to be provided, including deliverables, timeline, compensation, and intellectual property rights.',
      status: 'draft' as ContractStatus,
      value: 15000,
    },
    fields: [
      { id: 'f1', type: 'text', label: 'Consultant Name', required: true, position: { x: 0, y: 0 } },
      { id: 'f2', type: 'text', label: 'Consulting Scope', required: true, position: { x: 0, y: 1 } },
      { id: 'f3', type: 'date', label: 'Project Start Date', required: true, position: { x: 0, y: 2 } },
      { id: 'f4', type: 'date', label: 'Project End Date', required: false, position: { x: 1, y: 2 } },
      { id: 'f5', type: 'signature', label: 'Consultant Signature', required: true, position: { x: 0, y: 3 } },
    ],
  },
  {
    id: 'bp-contractor',
    name: 'Independent Contractor',
    description: 'Agreement for independent contractors and freelancers.',
    icon: 'UserCheck',
    category: 'employment',
    color: '#14b8a6',
    template: {
      title: 'Independent Contractor Agreement',
      description: 'This Independent Contractor Agreement establishes the working relationship between the company and contractor, clarifying that no employer-employee relationship exists.',
      status: 'draft' as ContractStatus,
      value: 8000,
    },
    fields: [
      { id: 'f1', type: 'text', label: 'Contractor Name', required: true, position: { x: 0, y: 0 } },
      { id: 'f2', type: 'text', label: 'Company Name', required: true, position: { x: 0, y: 1 } },
      { id: 'f3', type: 'text', label: 'Services Description', required: true, position: { x: 0, y: 2 } },
      { id: 'f4', type: 'date', label: 'Contract Start Date', required: true, position: { x: 0, y: 3 } },
      { id: 'f5', type: 'checkbox', label: 'Agrees to Terms', required: true, position: { x: 0, y: 4 }, defaultValue: false },
      { id: 'f6', type: 'signature', label: 'Contractor Signature', required: true, position: { x: 0, y: 5 } },
    ],
  },
];
