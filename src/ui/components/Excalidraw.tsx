declare global {
  interface Window {
    EXCALIDRAW_ASSET_PATH: string;
  }
}

import React, { useState, useEffect } from "react";

window.EXCALIDRAW_ASSET_PATH = "static://";

function Excalidraw() {
  const [Comp, setComp] = useState(null);
  useEffect(() => {
    import("@excalidraw/excalidraw").then((comp) => setComp(comp.default));
  });
  return <>{Comp && <Comp />}</>;
}

export default Excalidraw;
