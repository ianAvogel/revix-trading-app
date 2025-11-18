import { create } from 'zustand';

interface TimeStoreState {
  replayTimestamp: Date | null;
  isReplayActive: boolean;
  setReplayTimestamp: (timestamp: Date | null) => void;
}

export const useTimeStore = create<TimeStoreState>((set) => ({
  replayTimestamp: null,
  isReplayActive: false,
  setReplayTimestamp: (timestamp) => set({ replayTimestamp: timestamp, isReplayActive: !!timestamp }),
}));
