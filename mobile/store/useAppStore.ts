/**
 * useAppStore — Global app state (Zustand + AsyncStorage persistence)
 *
 * Stores the user's selected store so the Home screen can personalise
 * content. No login required — this is device-local state.
 *
 * The store persists across app restarts via AsyncStorage.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Store } from '@/types';

interface AppState {
  /** The store the user has selected as "My Store". Null until first selection. */
  selectedStore: Store | null;

  /** Whether the store picker has been shown on first launch */
  hasSeenStorePicker: boolean;

  setSelectedStore: (store: Store) => void;
  clearSelectedStore: () => void;
  markStorePickerSeen: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedStore: null,
      hasSeenStorePicker: false,

      setSelectedStore: (store) =>
        set({ selectedStore: store, hasSeenStorePicker: true }),

      clearSelectedStore: () => set({ selectedStore: null }),

      markStorePickerSeen: () => set({ hasSeenStorePicker: true }),
    }),
    {
      name: 'bbsm-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these keys — exclude transient state if added later
      partialize: (state) => ({
        selectedStore: state.selectedStore,
        hasSeenStorePicker: state.hasSeenStorePicker,
      }),
    }
  )
);
