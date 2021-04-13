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

  const searchStyle = function (cm, line, style) {
    const handle = cm.getLineHandle(line);
    let lastChar = 0;
    for (const styleIn of handle.styles) {
      if (typeof styleIn === "number") {
        lastChar = styleIn;
      } else if (styleIn && styleIn.indexOf(style) >= 0) {
        return lastChar;
      }
    }
    return 0;
  };

  const getCursorPosition = function (cm, exp) {
    const cursor = cm.getCursor();
    let { line, ch } = cursor;
    let lineContent = cm.getLine(line);
    let isBlock = lineContent == exp || lineContent.startsWith("$$");
    if (isBlock) {
      ch = 0;
      let index = searchStyle(cm, line, "formatting-math-end");
      while (index == 0) {
        line += 1;
        index = searchStyle(cm, line, "formatting-math-end");
      }
    } else {
      let index = lineContent.indexOf(exp) + exp.length + 1;
      while (ch > index) {
        index = lineContent.indexOf(exp, index) + exp.length + 1;
      }
      ch = index - exp.length - 1;
    }

    return cm.charCoords({ line, ch }, "window");
  };

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
        const { left, top } = getCursorPosition(cm, exp);
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
