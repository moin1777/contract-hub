export type ContractStatus = 'draft' | 'active' | 'expired' | 'terminated';

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
}
