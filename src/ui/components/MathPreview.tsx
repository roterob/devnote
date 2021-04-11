import React, { useEffect, useState, useRef } from "react";
import useAppStore from "../../app-store";

const NO_POSITION = {};
const LINE_HEIGHT = 30;

function MathPreview() {
  const mathPreview = useAppStore((store) => store.mathPreview);
  const [position, setPosition] = useState(NO_POSITION);
  const mathRenderer = useRef(null);
  const spanRef = useRef();
  const visible = position != NO_POSITION;

  useEffect(() => {
    if (mathPreview) {
      const { cm, exp } = mathPreview;
      if (!mathRenderer.current) {
        mathRenderer.current = cm.hmd.FoldMath.createRenderer(
          spanRef.current,
          "display"
        );
      }

      if (exp) {
        if (!mathRenderer.current.isReady()) {
          return;
        }
        const { left, top } = cm.charCoords(cm.getCursor(), "window");
        mathRenderer.current.startRender(exp);
        if (!visible) {
          setPosition({ left, top: top + LINE_HEIGHT });
        }
      } else {
        setPosition(NO_POSITION);
      }
    }
  }, [mathPreview]);

  return (
    <div
      className="devnote-math-preview"
      style={{
        display: visible ? "block" : "none",
        ...position,
      }}
    >
      <span ref={spanRef}></span>
    </div>
  );
}

export default MathPreview;
