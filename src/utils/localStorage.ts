import type { Contract } from '../types/contract';

const STORAGE_KEY = 'contracts';

export const loadContractsFromStorage = (): Contract[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading contracts from localStorage:', error);
  }
  return [];
};

export const saveContractsToStorage = (contracts: Contract[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  } catch (error) {
    console.error('Error saving contracts to localStorage:', error);
  }
};
