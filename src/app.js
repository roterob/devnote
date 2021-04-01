import { remote } from "electron";
import { promises as fs, existsSync } from "fs";
import * as path from "path";
import debounce from "lodash.debounce";

import document from "./document";
import { getDateTime, getFilterTags, getHumanizedDateTime } from "./utils";

const { app } = remote;

const APP = (function () {
  let state = {};
  let editor = null;
  let mdDocument = null;

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

    cm.on("change", (cm, value) => {});
  }

  function setState(key, value) {
    if (typeof value == "undefined") {
      return;
    }

    const newState = { ...state, ...{ [key]: value } };
    state = newState;
    localStorage.setItem("dn-state", JSON.stringify(state));
  }

  function saveCurrent() {
    const md = editor.getValue();
    mdDocument.updateCurrentSections(md);
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
    setState("lastFile", fileToOpen);
    mdDocument = document(txt.toString());
    editor.setValue(mdDocument.filter());
  }

  function filterCommand(cliArgs) {
    saveCurrent();
    const [tags, from] = getFilterTags(cliArgs);
    editor.setValue(mdDocument.filter(tags, from || state.from));
    setState("tags", tags || null);
    setState("from", from);
  }

  function fromCommand(cliArgs = []) {
    saveCurrent();
    const args = cliArgs.join(" ");
    const from = getDateTime(args) || getHumanizedDateTime(args);
    const tags = state.tags || [];
    editor.setValue(mdDocument.filter(tags, from));
    setState("from", from || null);
  }

  async function writeCommand(filePath) {
    saveCurrent();
    let fileToSave = filePath || state.lastFile;
    if (!fileToSave) {
      throw "No file path";
    }

    if (!path.isAbsolute(fileToSave)) {
      fileToSave = path.join(state.pwd, fileToSave);
    }
    await fs.writeFile(fileToSave, mdDocument.toString());
    setState("lastFile", fileToSave);
    return `${fileToSave} saved!`;
  }
  function insertCommand() {}
  function tocCommand() {}
  function saveCommnad() {}
  function printCommand(tags) {}

  return {
    init,
    pwdCommand,
    cwdCommand,
    openCommand,
    echoCommand,
    filterCommand,
    fromCommand,
    writeCommand,
  };
})();

export default APP;
