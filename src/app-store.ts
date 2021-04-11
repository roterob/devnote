import create from "zustand";

type AppState = {
  mathPreview: {
    cm: any;
    exp: any;
  };
  setMathPreview: (v: any) => void;
};

const useStore = create<AppState>((set) => ({
  mathPreview: null,
  setMathPreview: (v) => set({ mathPreview: v }),
}));

export default useStore;
