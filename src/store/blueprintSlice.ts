import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Blueprint, BlueprintField } from '../types/blueprint';
import { defaultBlueprints } from '../types/blueprint';
import { v4 as uuidv4 } from 'uuid';

// LocalStorage helpers
const STORAGE_KEY = 'contract-manager-blueprints';

const loadBlueprintsFromStorage = (): Blueprint[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load blueprints from localStorage:', error);
  }
  return [];
};

const saveBlueprintsToStorage = (blueprints: Blueprint[]) => {
  try {
    // Only save custom blueprints
    const customBlueprints = blueprints.filter((bp) => bp.isCustom);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customBlueprints));
  } catch (error) {
    console.error('Failed to save blueprints to localStorage:', error);
  }
};

interface BlueprintState {
  blueprints: Blueprint[];
  editingBlueprint: Blueprint | null;
}

// Merge default blueprints with custom ones from storage
const customBlueprints = loadBlueprintsFromStorage();
const initialState: BlueprintState = {
  blueprints: [...defaultBlueprints, ...customBlueprints],
  editingBlueprint: null,
};

const blueprintSlice = createSlice({
  name: 'blueprints',
  initialState,
  reducers: {
    addBlueprint: (state, action: PayloadAction<Omit<Blueprint, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>>) => {
      const newBlueprint: Blueprint = {
        ...action.payload,
        id: `bp-custom-${uuidv4()}`,
        isCustom: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.blueprints.push(newBlueprint);
      saveBlueprintsToStorage(state.blueprints);
    },

    updateBlueprint: (state, action: PayloadAction<{ id: string; updates: Partial<Blueprint> }>) => {
      const index = state.blueprints.findIndex((bp) => bp.id === action.payload.id);
      if (index !== -1) {
        state.blueprints[index] = {
          ...state.blueprints[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
        saveBlueprintsToStorage(state.blueprints);
      }
    },

    deleteBlueprint: (state, action: PayloadAction<string>) => {
      const blueprint = state.blueprints.find((bp) => bp.id === action.payload);
      // Only allow deleting custom blueprints
      if (blueprint?.isCustom) {
        state.blueprints = state.blueprints.filter((bp) => bp.id !== action.payload);
        saveBlueprintsToStorage(state.blueprints);
      }
    },

    addFieldToBlueprint: (state, action: PayloadAction<{ blueprintId: string; field: Omit<BlueprintField, 'id'> }>) => {
      const blueprint = state.blueprints.find((bp) => bp.id === action.payload.blueprintId);
      if (blueprint) {
        const newField: BlueprintField = {
          ...action.payload.field,
          id: `field-${uuidv4()}`,
        };
        blueprint.fields.push(newField);
        blueprint.updatedAt = new Date().toISOString();
        saveBlueprintsToStorage(state.blueprints);
      }
    },

    updateFieldInBlueprint: (
      state,
      action: PayloadAction<{ blueprintId: string; fieldId: string; updates: Partial<BlueprintField> }>
    ) => {
      const blueprint = state.blueprints.find((bp) => bp.id === action.payload.blueprintId);
      if (blueprint) {
        const fieldIndex = blueprint.fields.findIndex((f) => f.id === action.payload.fieldId);
        if (fieldIndex !== -1) {
          blueprint.fields[fieldIndex] = {
            ...blueprint.fields[fieldIndex],
            ...action.payload.updates,
          };
          blueprint.updatedAt = new Date().toISOString();
          saveBlueprintsToStorage(state.blueprints);
        }
      }
    },

    removeFieldFromBlueprint: (state, action: PayloadAction<{ blueprintId: string; fieldId: string }>) => {
      const blueprint = state.blueprints.find((bp) => bp.id === action.payload.blueprintId);
      if (blueprint) {
        blueprint.fields = blueprint.fields.filter((f) => f.id !== action.payload.fieldId);
        blueprint.updatedAt = new Date().toISOString();
        saveBlueprintsToStorage(state.blueprints);
      }
    },

    setEditingBlueprint: (state, action: PayloadAction<Blueprint | null>) => {
      state.editingBlueprint = action.payload;
    },

    duplicateBlueprint: (state, action: PayloadAction<string>) => {
      const original = state.blueprints.find((bp) => bp.id === action.payload);
      if (original) {
        const duplicate: Blueprint = {
          ...original,
          id: `bp-custom-${uuidv4()}`,
          name: `${original.name} (Copy)`,
          isCustom: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          fields: original.fields.map((f) => ({ ...f, id: `field-${uuidv4()}` })),
        };
        state.blueprints.push(duplicate);
        saveBlueprintsToStorage(state.blueprints);
      }
    },
  },
});

export const {
  addBlueprint,
  updateBlueprint,
  deleteBlueprint,
  addFieldToBlueprint,
  updateFieldInBlueprint,
  removeFieldFromBlueprint,
  setEditingBlueprint,
  duplicateBlueprint,
} = blueprintSlice.actions;

export default blueprintSlice.reducer;
