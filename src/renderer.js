import * as fs from 'fs';
import debounce from 'lodash.debounce';
import CodeMirror from 'codemirror/lib/codemirror';
import './codemirror/markdown';
import './codemirror/vim';
import * as HyperMD from './hypermd';

import './index.css';
import './hypermd/assets/hypermd-mode.css';
import './hypermd/assets/hypermd.scss';

const myTextarea = document.getElementById('demo');

const editor = HyperMD.fromTextArea(myTextarea, {
  keyMap: 'vim',
  lineNumbers: false,
  foldGutter: false,
  // extraKeys: "hyperm
  viewportMargin: Infinity,
  mode: {
    name: 'hypermd',
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

editor.setSize(null, '100%'); // set height
editor.on('vim-mode-change', ({ mode }) => {
  console.log('-->', mode);
  if (mode == 'insert') {
    setTimeout(() => {
      editor.setOption('keyMap', 'hypermd');
    }, 0);
  }
});
editor.on('keyHandled', (cm, name) => {
  if (name === 'Esc') {
    console.log(cm.getOption('keyMap'));
    editor.setOption('keyMap', 'vim');
  }
});

const file = "C:\\Users\\Moncho\\Desktop\\docs\\notepad.md";
const writeFile = debounce(data => {
  fs.writeFileSync(file, data);
  console.log("file saved!");
}, 1000);
const text = fs.readFileSync(
  file,
  { encoding: "utf-8" }
);
editor.setValue(text);

editor.on("change", () => {
  writeFile(editor.getValue());
});

// for debugging
window.CodeMirror = CodeMirror;
window.HyperMD = HyperMD;
window.editor = editor;
window.cm = editor;
