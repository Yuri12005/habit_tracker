import { create } from 'zustand';

interface NotificationStore {
  count: number;
  setCount: (count: number) => void;
  decrement: () => void;
  increment: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
  decrement: () => set((state) => ({ count: Math.max(state.count - 1) })),
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
