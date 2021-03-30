import { remote } from "electron";
import { promises as fs, existsSync } from "fs";
import * as path from "path";
import debounce from "lodash.debounce";

const { app } = remote;

const APP = (function () {
  let state = {};
  let editor = null;



  async function loadDocument(url) {
    //1) Loading the document
    const txt = await fetch(url).then((r) => r.text());
    //2) Parsing the documment
    buildDocument(txt);
    //3) Show default sections
    return filterDocument();
  }

  const writeFile = debounce((data) => {
    fs.writeFileSync(file, data);
  }, 1000);

  function init(cm) {
    editor = cm;
    state = JSON.parse(localStorage.getItem("dn-state") || "{}");
    //defaults;
    state.pwd = state.pwd || app.getPath("home");

    if (state.lastFile && existsSync(state.lastFile)) {
      openCommand(state.lastFile);
    }

    cm.on("change", (cm, value) => {

    });
  }

  function setState(key, value) {
    const newState = { ...state, ...{ [key]: value } };
    state = newState;
    localStorage.setItem("dn-state", JSON.stringify(state));
  }

  function echoCommand(value) {
    let res = value;
    const maps = {
      "@%": () => state.lastFile,
      "%": () => path.basename(state.lastFile),
    };
    if (maps[value]) {
      res = maps[value]();
    }
    return res;
  }

  function pwdCommand() {
    return state.pwd;
  }

  async function cwdCommand(dir) {
    let newPwd = dir;
    if (!newPwd && state.lastFile) {
      newPwd = path.dirname(state.lastFile);
    }

    const stat = await fs.lstat(newPwd);
    if (!stat.isDirectory()) {
      throw `no directory ${newPwd}`;
    }

    setState("pwd", newPwd);
    return newPwd;
  }

  function setCommand(option, value) {}

  async function openCommand(filePath) {
    let fileToOpen = filePath;
    if (!path.isAbsolute(filePath)) {
      fileToOpen = path.join(state.pwd, filePath);
    }
    const txt = await fs.readFile(fileToOpen);
    editor.setValue(txt.toString());
    setState("lastFile", fileToOpen);
  }

  async function writeCommand(filePath) {

  }

  function loadCommand() {}
  function insertCommand() {}
  function tagCommand(tags, from, to) {}
  function tocCommand() {}
  function saveCommnad() {}
  function printCommand(tags) {}

  return {
    init,
    pwdCommand,
    cwdCommand,
    openCommand,
    echoCommand,
  };
})();

export default APP;
