export type ContractStatus = 'draft' | 'active' | 'expired' | 'terminated';

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
}

export interface ContractFormData {
  clientName: string;
  title: string;
  description: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  value: number;
}
