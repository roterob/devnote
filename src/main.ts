import * as path from "path";
import { createReadStream, existsSync } from "fs";
import { app, BrowserWindow, ipcMain, protocol, dialog } from "electron";
import { FILE_PROTOCOL } from "./constants";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
let appState: any = {};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const requestFileHandler = (request, callback) => {
  const url = new URL(
    "http://localhost/" + request.url.substr(FILE_PROTOCOL.length + 3)
  );
  const name = url.searchParams.get("name");
  const extension = url.searchParams.get("ext");
  const type = url.searchParams.get("type");

  const pathToFile = path.join(appState.pwd, "files", url.pathname);
  callback(createReadStream(pathToFile));
};

const staticFileHandler = (request, callback) => {
  const fileUrl = request.url.replace("static://", "");
  let filePath = path.join(
    app.getAppPath(),
    ".webpack/renderer/static",
    fileUrl
  );
  callback(filePath);
};

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  setTimeout(() => {
    // https://github.com/electron/electron/issues/19554
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  }, 100);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Hide menu
  mainWindow.setMenu(null);

  // Register protocol
  protocol.registerStreamProtocol(FILE_PROTOCOL, requestFileHandler);
  protocol.registerFileProtocol("static", staticFileHandler);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("devnote-update-state", (event, state) => {
  appState = state;
});
