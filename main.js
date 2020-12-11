const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const url = require("url");
const shell = require("electron").shell;
const ipc = require("electron").ipcMain;

let win;
function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    width: 800,
    height: 600,
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "src/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  win.on("close", () => {
    win = null;
  });

  win.webContents.on("devtools-opened", () => {
    win.webContents.closeDevTools();
  });

  var menu = Menu.buildFromTemplate([
    {
      label: "Menu",
      submenu: [
        {
          label: "Adjust Notification Value",
        },
        {
          type: "separator",
        },
        {
          label: "Coint Market Cap",
          click() {
            shell.openExternal("http://coinmarketcap.com");
          },
        },
        {
          type: "separator",
        },
        {
          label: "Exit",
          click() {
            app.quit();
          },
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

ipc.on("update-notify-value", (event, arg) => {
  win.webContents.send("targetPriceVal", arg);
});
