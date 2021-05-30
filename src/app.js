import { remote, ipcRenderer } from "electron";
import { promises as fs, existsSync, createWriteStream, mkdirSync } from "fs";
import * as path from "path";

import document from "./document";
import { FILE_PROTOCOL } from "./constants";
import {
  getDateTime,
  getFilterTags,
  getHumanizedDateTime,
  objectId,
} from "./utils";
import { getCmCurrentLine, replaceCmCurrentLine } from "./ui/components/utils";

const { app } = remote;

const APP = (function () {
  let state = {};
  let editor = null;
  let store = null;
  let mdDocument = null;
  let currentChanged = false;

  const editorChangeHandler = (cm, changeObj) => {
    currentChanged = true;
  };

  function init(cm, storeSetters) {
    editor = cm;
    store = storeSetters;
    state = JSON.parse(localStorage.getItem("dn-state") || "{}");
    ipcRenderer.invoke("devnote-update-state", state);
    //defaults;
    state.pwd = state.pwd || app.getPath("home");

    if (state.lastFile && existsSync(state.lastFile)) {
      openCommand(state.lastFile);
    }

    cm.on("change", editorChangeHandler);
  }

  function setEditorValue(value) {
    editor.off("change", editorChangeHandler);
    editor.setValue(value);
    editor.on("change", editorChangeHandler);
  }

  function saveCurrent() {
    if (currentChanged) {
      const md = editor.getValue();
      mdDocument.updateCurrentSections(md);
      currentChanged = false;
    }
  }

  function setState(key, value) {
    if (typeof value == "undefined") {
      return;
    }

    const newState = { ...state, ...{ [key]: value } };
    state = newState;
    localStorage.setItem("dn-state", JSON.stringify(state));
    ipcRenderer.invoke("devnote-update-state", state);
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
    setEditorValue(mdDocument.filter());
  }

  function reloadCommand() {
    setEditorValue(editor.getValue());
  }

  function filterCommand(cliArgs) {
    saveCurrent();
    const [tags, from] = getFilterTags(cliArgs);
    setEditorValue(mdDocument.filter(tags, from || state.from));
    setState("tags", tags || null);
    setState("from", from);
  }

  function emptyCommand() {
    filterCommand([objectId()]);
  }

  function fromCommand(cliArgs = []) {
    saveCurrent();
    const args = cliArgs.join(" ");
    const from = getDateTime(args) || getHumanizedDateTime(args);
    const tags = state.tags || [];
    setEditorValue(mdDocument.filter(tags, from));
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
  function drawCommand() {}
  function insertCommand() {}
  function tocCommand() {}
  function printCommand(tags) {}

  async function uploadFile(file) {
    return saveFile(file);
  }

  async function saveDraw(elementsBlob, png, drawInfo) {
    const elementsId = (drawInfo || {}).drawId || objectId();
    await saveFile(elementsBlob, `${elementsId}.exca`);
    const url = await saveFile(png, `${elementsId}.png`);
    insertImageInEditor(
      `${url}&exca=${elementsId}&align=${
        (drawInfo || {}).align || ""
      }&ts=${new Date().getTime()}`
    );
    return url;
  }

  async function getDrawInfo() {
    const line = getCmCurrentLine(editor);
    if (line) {
      if (line.match(/exca=(\w+)/)) {
        const drawId = RegExp.$1;
        const filePath = path.join(state.pwd, "files", `${drawId}.exca`);
        const content = await fs.readFile(filePath);
        const { elements } = JSON.parse(content.toString());
        let align = "";
        if (line.match(/align=(\w*)/)) {
          align = RegExp.$1;
        }
        return { drawId, elements, align };
      } else {
        throw "must be a draw or a empty line";
      }
    }
    return null;
  }

  function insertImageInEditor(url) {
    const value = `![](${url})`;
    replaceCmCurrentLine(editor, value);
  }

  async function saveFile(file, fileName) {
    let originalName = "";
    if (!fileName) {
      const [name, extension] = file.name.split(".");
      fileName = `${objectId()}.${extension}`;
      originalName = name;
    }

    const [name, extension] = fileName.split(".");

    const fileRepository = path.join(state.pwd, "files");
    if (!existsSync(fileRepository)) {
      await fs.mkdir(fileRepository, { recursive: true });
    }

    const filePath = path.join(state.pwd, "files", fileName);
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    await fs.writeFile(filePath, data);
    return `${FILE_PROTOCOL}://${fileName}?name=${originalName}&ext=${extension}`;
  }

  async function drawCommand() {
    const drawInfo = await APP.getDrawInfo();
    store.setDrawMode({ app: APP, drawInfo });
  }

  return {
    init,
    uploadFile,
    saveDraw,
    pwdCommand,
    cwdCommand,
    openCommand,
    reloadCommand,
    emptyCommand,
    echoCommand,
    filterCommand,
    fromCommand,
    writeCommand,
    drawCommand,
    getDrawInfo,
  };
})();

export default APP;
