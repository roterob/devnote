import { remote } from "electron";
import { promises as fs, existsSync } from "fs";
import * as path from "path";
// import debounce from "lodash.debounce";

const { app } = remote;

const APP = (function () {
  const MAX_LINES_TO_SHOW = 1000;
  let numSections = 0;
  const document = {};
  const tagIndex = {};
  let state = {};
  let editor = null;

  function buildDocument(md) {
    const TAG_RE = /#([\w-_0-9\/])*\b/g;
    const lines = md.split(/\r?\n/);
    var blockLines = [];
    var tags = [];

    function addSection() {
      if (blockLines.length > 0) {
        document[numSections] = {
          id: numSections,
          tags,
          md: blockLines.join("\n"),
          nol: blockLines.length,
        };
        for (const tag of tags) {
          const list = tagIndex[tag] || [];
          list.push(numSections);
          tagIndex[tag] = list;
        }
      }
    }

    for (const line of lines) {
      if (line.startsWith("--- #")) {
        addSection();
        blockLines = [line];
        tags = [...line.matchAll(TAG_RE)].map((g) => g[1]);
        numSections += 1;
      } else {
        blockLines.push(line);
      }
    }
    addSection();
  }

  function filterDocument() {
    let numOfLines = 0;
    let current = numSections;
    const blocks = [];
    while (current > 0 && numOfLines < MAX_LINES_TO_SHOW) {
      const section = document[current];
      numOfLines += section.nol;
      blocks.unshift(section.md);
      current -= 1;
    }
    return blocks.join("\n");
  }

  async function loadDocument(url) {
    //1) Loading the document
    const txt = await fetch(url).then((r) => r.text());
    //2) Parsing the documment
    buildDocument(txt);
    //3) Show default sections
    return filterDocument();
  }

  function init(cm) {
    editor = cm;
    state = JSON.parse(localStorage.getItem("dn-state") || "{}");
    //defaults;
    state.pwd = state.pwd || app.getPath("home");

    if (state.lastFile && existsSync(state.lastFile)) {
      openCommand(state.lastFile);
    }
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

  // const writeFile = debounce((data) => {
  //   fs.writeFileSync(file, data);
  //   console.log("file saved!");
  // }, 1000);

  async function openCommand(filePath) {
    let fileToOpen = filePath;
    if (!path.isAbsolute(filePath)) {
      fileToOpen = path.join(state.pwd, filePath);
    }
    const txt = await fs.readFile(fileToOpen);
    editor.setValue(txt.toString());
    setState("lastFile", fileToOpen);
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
