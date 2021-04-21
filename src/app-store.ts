import create from "zustand";

type AppState = {
  mathPreview: {
    cm: any;
    exp: any;
  };
  drawMode: {
    app?: any;
  };
  setMathPreview: (v: any) => void;
  setDrawMode: (v: any) => void;
};

const useStore = create<AppState>((set) => ({
  mathPreview: null,
  drawMode: null,
  setMathPreview: (v) => set({ mathPreview: v }),
  setDrawMode: (v) => set({ drawMode: v }),
}));

export default useStore;
