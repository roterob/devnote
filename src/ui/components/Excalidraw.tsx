declare global {
  interface Window {
    EXCALIDRAW_ASSET_PATH: string;
  }
}

import React, { useState, useEffect } from "react";
import useAppStore from "../../app-store";
import Modal from "./Modal";

window.EXCALIDRAW_ASSET_PATH = "static://";

const uiOptions = {
  canvasActions: {
    export: false,
    loadScene: false,
    saveAsScene: false,
  },
};

function Excalidraw() {
  const [Comp, setComp] = useState(null);
  const drawMode = useAppStore((store) => store.drawMode);
  const setDrawMode = useAppStore((store) => store.setDrawMode);

  const handleClose = () => {
    setDrawMode(null);
  };

  useEffect(() => {
    import("@excalidraw/excalidraw").then((comp) => setComp(comp.default));
  });

  return (
    drawMode && (
      <Modal onClose={handleClose}>
        <>{Comp && <Comp UIOptions={uiOptions} />}</>
      </Modal>
    )
  );
}

export default Excalidraw;
