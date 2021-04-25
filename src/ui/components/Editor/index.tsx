declare global {
  interface Window {
    MyNamespace: any;
    CodeMirror: any;
    HyperMD: any;
    editor: any;
    cm: any;
    APP: any;
  }
}

import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror/lib/codemirror";

import APP from "../../../app";
import useAppStore from "../../../app-store";

import "./lib/codemirror/markdown";
import "./lib/codemirror/vim";
import * as HyperMD from "./lib/hypermd";
import "./lib/hypermd/assets/hypermd-mode.css";
import "./lib/hypermd/assets/hypermd.scss";

import "./lib/hypermd/powerpack/fold-math-with-katex";
import "./lib/hypermd/powerpack/insert-file-with-smms";

function Editor() {
  const setMathPreview = useAppStore((store) => store.setMathPreview);
  const setDrawMode = useAppStore((store) => store.setDrawMode);

  const textAreaRef = useRef();

  useEffect(() => {
    const cmeditor = HyperMD.fromTextArea(textAreaRef.current, {
      keyMap: "vim",
      lineNumbers: true,
      foldGutter: true,
      viewportMargin: Infinity,
      mode: {
        name: "hypermd",
        hashtag: true, // this syntax is not actived by default
      },
      // hmdClick: clickHandler,
      hmdFold: {
        image: true,
        link: true,
        math: true,
        html: true, // maybe dangerous
        emoji: true,
      },
      hmdFoldMath: {
        onPreview: (exp) => setMathPreview({ cm: cmeditor, exp }),
        onPreviewEnd: () => setMathPreview({ cm: cmeditor, exp: null }),
      },
      autoCloseBrackets: true,
    });

    cmeditor.setOption("hmdReadLink", { baseURI: "./" }); // for images and links in Markdown
    cmeditor.setSize(null, "100%"); // set height
    cmeditor.on("vim-mode-change", ({ mode }) => {
      if (mode == "insert") {
        setTimeout(() => {
          cmeditor.setOption("keyMap", "hypermd");
        }, 0);
      }
    });
    cmeditor.on("keyHandled", (cm, name) => {
      if (name === "Esc") {
        cmeditor.setOption("keyMap", "vim");
      }
    });

    // CodeMirror.Vim.defineEx("draw", "dr", drawHandler);

    APP.init(cmeditor, { setDrawMode, setMathPreview });

    // for debugging
    window.CodeMirror = CodeMirror;
    window.HyperMD = HyperMD;
    window.editor = cmeditor;
    window.cm = cmeditor;
    window.APP = APP;
  }, []);

  return (
    <div id="editor_area">
      <textarea ref={textAreaRef} style={{ display: "none" }}></textarea>
    </div>
  );
}

export default Editor;
