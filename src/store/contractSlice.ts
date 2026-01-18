import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { Contract, ContractFormData, ContractStatus } from '../types/contract';
import { statusTransitions } from '../types/contract';
import { loadContractsFromStorage, saveContractsToStorage } from '../utils/localStorage';

interface ContractState {
  contracts: Contract[];
  searchQuery: string;
  filterStatus: string;
}

const initialState: ContractState = {
  contracts: loadContractsFromStorage(),
  searchQuery: '',
  filterStatus: 'all',
};

const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    addContract: (state, action: PayloadAction<ContractFormData>) => {
      const now = new Date().toISOString();
      const newContract: Contract = {
        ...action.payload,
        id: uuidv4(),
        status: 'created', // Always start with 'created' status
        createdAt: now,
        updatedAt: now,
      };
      state.contracts.push(newContract);
      saveContractsToStorage(state.contracts);
    },
    updateContract: (state, action: PayloadAction<{ id: string; data: ContractFormData }>) => {
      const index = state.contracts.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        const contract = state.contracts[index];
        // Cannot edit locked or revoked contracts
        if (contract.status === 'locked' || contract.status === 'revoked') {
          return;
        }
        state.contracts[index] = {
          ...state.contracts[index],
          ...action.payload.data,
          updatedAt: new Date().toISOString(),
        };
        saveContractsToStorage(state.contracts);
      }
    },
    changeContractStatus: (state, action: PayloadAction<{ id: string; newStatus: ContractStatus }>) => {
      const index = state.contracts.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        const contract = state.contracts[index];
        const allowedTransitions = statusTransitions[contract.status];
        
        // Check if transition is allowed
        if (allowedTransitions.includes(action.payload.newStatus)) {
          state.contracts[index] = {
            ...contract,
            status: action.payload.newStatus,
            updatedAt: new Date().toISOString(),
          };
          saveContractsToStorage(state.contracts);
        }
      }
    },
    deleteContract: (state, action: PayloadAction<string>) => {
      state.contracts = state.contracts.filter((c) => c.id !== action.payload);
      saveContractsToStorage(state.contracts);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
  },
});

export const {
  addContract,
  updateContract,
  changeContractStatus,
  deleteContract,
  setSearchQuery,
  setFilterStatus,
} = contractSlice.actions;

export default contractSlice.reducer;
