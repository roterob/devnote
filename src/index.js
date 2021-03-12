import CodeMirror from "codemirror/lib/codemirror";
import "./codemirror/markdown";
import "./codemirror/vim";
import * as HyperMD from "./hypermd";

import "./styles.scss";
import "./hypermd/assets/hypermd-mode.css";
import "./hypermd/assets/hypermd.scss";

const myTextarea = document.getElementById("demo");

const editor = HyperMD.fromTextArea(myTextarea, {
  keyMap: "vim",
  lineNumbers: false,
  foldGutter: false,
  // extraKeys: "hypermd",
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

// for debugging
window.CodeMirror = CodeMirror;
window.HyperMD = HyperMD;
window.editor = editor;
window.cm = editor;
