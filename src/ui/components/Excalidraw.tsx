declare global {
  interface Window {
    EXCALIDRAW_ASSET_PATH: string;
  }
}

import React, { useState, useEffect, useRef, useMemo } from "react";
import useAppStore from "../../app-store";
import Modal from "./Modal";
import { exportToBlob } from "@excalidraw/excalidraw";

window.EXCALIDRAW_ASSET_PATH = "static://";

const UIOptions = {
  canvasActions: {
    export: false,
    loadScene: false,
    saveAsScene: false,
  },
};

function Excalidraw() {
  const [Comp, setComp] = useState(null);
  const excalidrawRef = useRef(null);
  const drawMode = useAppStore((store) => store.drawMode);
  const setDrawMode = useAppStore((store) => store.setDrawMode);

  const handleClose = () => {
    setDrawMode(null);
  };

  const handleChange = (elements, appState) => {
    // drawMode.app?.saveExcalidrawState({
    //   elements,
    //   appState,
    // });
  };

  const saveFile = function () {
    return {
      blob: null,
      async write(blob) {
        this.blob = blob;
      },
      async close() {
        const elements = excalidrawRef.current.getSceneElements();
        const appState = excalidrawRef.current.getAppState();
        const png = await exportToBlob({ elements, appState });
        const { app, drawInfo } = drawMode;
        await app.saveDraw(this.blob, png, drawInfo);
        handleClose();
      },
    };
  };

  const initialData = useMemo(() => {
    if (drawMode) {
      const { drawInfo } = drawMode;
      return {
        elements: drawInfo ? drawInfo.elements : [],
        appState: {
          fileHandle: {
            createWritable: saveFile,
          },
        },
      };
    }
    return null;
  }, [drawMode]);

  useEffect(() => {
    import("@excalidraw/excalidraw").then((comp) => setComp(comp.default));
  });

  return (
    drawMode && (
      <Modal onClose={handleClose}>
        <>
          {Comp && (
            <Comp
              ref={excalidrawRef}
              onChange={handleChange}
              {...{ UIOptions, initialData }}
            />
          )}
        </>
      </Modal>
    )
  );
}

export default Excalidraw;
