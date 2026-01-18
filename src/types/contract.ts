// Contract Lifecycle: Created → Approved → Sent → Signed → Locked
// Revoked can occur after creation or sending
export type ContractStatus = 'created' | 'approved' | 'sent' | 'signed' | 'locked' | 'revoked';

// Status transition rules
export const statusTransitions: Record<ContractStatus, ContractStatus[]> = {
  created: ['approved', 'revoked'],
  approved: ['sent', 'revoked'],
  sent: ['signed', 'revoked'],
  signed: ['locked'],
  locked: [], // Cannot transition from locked
  revoked: [], // Cannot transition from revoked
};

// Status display info
export const statusInfo: Record<ContractStatus, { label: string; color: string; bgColor: string }> = {
  created: { label: 'Created', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  approved: { label: 'Approved', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  sent: { label: 'Sent', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  signed: { label: 'Signed', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  locked: { label: 'Locked', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  revoked: { label: 'Revoked', color: 'text-red-700', bgColor: 'bg-red-100' },
};

// Custom field values stored on a contract
export interface CustomFieldValue {
  fieldId: string;
  label: string;
  type: 'text' | 'date' | 'signature' | 'checkbox';
  value: string | boolean;
}

export interface Contract {
  id: string;
  clientName: string;
  title: string;
  description: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  value: number;
  createdAt: string;
  updatedAt: string;
  customFields?: CustomFieldValue[];
  blueprintName?: string; // Track which blueprint was used
}

export interface ContractFormData {
  clientName: string;
  title: string;
  description: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  value: number;
  customFields?: CustomFieldValue[];
  blueprintName?: string;
}
