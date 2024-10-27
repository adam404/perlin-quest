// src/store.js
import create from "zustand";

const useStore = create((set) => ({
  // Define your state variables
  score: 0,
  level: 1,
  // Define actions to update state
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  nextLevel: () => set((state) => ({ level: state.level + 1 })),
}));

export default useStore;
