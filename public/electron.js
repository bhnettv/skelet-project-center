const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
// Storage:
const os = require('os');
const storage = require('electron-json-storage');
//storage.setDataPath(os.tmpdir());

const path  = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

require("update-electron-app")({
  repo: "kitze/react-electron-example",
  updateInterval: "1 hour"
});

function createWindow()
{
    mainWindow = new BrowserWindow({ width: 1000, height: 780 });

    storage.get('config', function(error, data) {
        if (error) throw error;

        console.log('config1', data);
        let url = isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`;

        if (data.app_server) {
          url = "http://"+data.app_server;
        }

        mainWindow.loadURL(url);
    });

  mainWindow.on("closed", () => (mainWindow = null));

  mainWindow.on('error', function (error) {
      console.log('error Window:',error);
  })
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
