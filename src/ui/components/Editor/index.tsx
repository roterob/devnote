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

import "./lib/codemirror/markdown";
import "./lib/codemirror/vim";
import * as HyperMD from "./lib/hypermd";
import "./lib/hypermd/assets/hypermd-mode.css";
import "./lib/hypermd/assets/hypermd.scss";

import "./lib/hypermd/powerpack/fold-math-with-katex";
import "./lib/hypermd/powerpack/insert-file-with-smms";

function Editor() {
  const textAreaRef = useRef();

  useEffect(() => {
    const editor = HyperMD.fromTextArea(textAreaRef.current, {
      keyMap: "vim",
      lineNumbers: false,
      foldGutter: false,
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
    });

    editor.setOption("hmdReadLink", { baseURI: "./" }); // for images and links in Markdown
    editor.setSize(null, "100%"); // set height
    editor.on("vim-mode-change", ({ mode }) => {
      console.log("-->", mode);
      if (mode == "insert") {
        setTimeout(() => {
          editor.setOption("keyMap", "hypermd");
        }, 0);
      }
    });
    editor.on("keyHandled", (cm, name) => {
      if (name === "Esc") {
        console.log(cm.getOption("keyMap"));
        editor.setOption("keyMap", "vim");
      }
    });

    APP.init(editor);

    // for debugging
    window.CodeMirror = CodeMirror;
    window.HyperMD = HyperMD;
    window.editor = editor;
    window.cm = editor;
    window.APP = APP;
  }, []);

  return <textarea ref={textAreaRef} style={{ display: "none" }}></textarea>;
}

export default Editor;
