import { remote } from "electron";
import { promises as fs, existsSync } from "fs";
import * as path from "path";
import * as chrono from "chrono-node";
import debounce from "lodash.debounce";

import document from "./document";

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

  function getDateTime(cliArgs) {
    let res = null;
    if (cliArgs && cliArgs.length > 0) {
      const date = chrono.parseDate(cliArgs.join(" "));
      if (date) {
        res = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        ).getTime();
      }
    }
    return res;
  }

  function getFilterTags(cliArgs) {
    if (!cliArgs || cliArgs.length == 0) {
      return [];
    }
    const tags = [];
    for (let i = 0; i < cliArgs.length; i++) {
      const tag = cliArgs[i];
      if (tag == "--from") {
        return [tags, getDateTime(cliArgs.slice(i + 1))];
      } else {
        tags.push(tag);
      }
    }
    return [tags];
  }

  function filterCommand(cliArgs) {
    const [tags, from] = getFilterTags(cliArgs);
    editor.setValue(mdDocument.filter(tags, from));
    setState("tags", tags || null);
    setState("from", from);
  }

  function fromCommand(cliArgs) {
    const from = getDateTime(cliArgs);
    const tags = state.tags || [];
    editor.setValue(mdDocument.filter(tags, from));
    setState("from", from || null);
  }

  async function writeCommand(filePath) {}
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
  };
})();

export default APP;
