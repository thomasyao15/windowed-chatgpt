require("update-electron-app")();

const Nucleus = require("nucleus-analytics");

const path = require("path");
const {
  app,
  nativeImage,
  BrowserWindow,
  Menu,
  shell,
  globalShortcut,
} = require("electron");
const contextMenu = require("electron-context-menu");

const image = nativeImage.createFromPath(
  path.join(__dirname, `images/newiconTemplate.png`)
);

function createWindow() {
  const win = new BrowserWindow({
    icon: image,
    webPreferences: {
      webviewTag: true,
      preload: path.join(__dirname, "preload.js"),
    },
    width: 765,
    height: 1440,
    autoHideMenuBar: false,
    frame: false,
  });

  win.loadURL(`file://${__dirname}/index.html`);

  win.on("focus", () => {
    win.webContents.send("focus-textbox");
  });

  return win;
}

app.on("ready", () => {
  Nucleus.init("638d9ccf4a5ed2dae43ce122");

  let lastFocusedWindow = createWindow();

  globalShortcut.register("CommandOrControl+Shift+g", () => {
    if (lastFocusedWindow.isVisible() && lastFocusedWindow.isFocused()) {
      // lastFocusedWindow.hide(); // this causes some issues with the window not showing up again
      // restore focus to the previous app on mac
      if (process.platform == "darwin") {
        app.hide();
      }
    } else {
      app.show();
      lastFocusedWindow.show();
      lastFocusedWindow.focus();
    }
  });

  app.on("web-contents-created", (e, contents) => {
    if (contents.getType() == "webview") {
      const window = BrowserWindow.fromWebContents(contents);

      window.on("focus", () => {
        lastFocusedWindow = window;
      });

      contents.on("dom-ready", () => {
        lastFocusedWindow.show();
        lastFocusedWindow.focus();

        setTimeout(function () {
          lastFocusedWindow.webContents.send("focus-textbox");
        }, 1000);
      });

      // open link with external browser in webview
      contents.on("new-window", (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
      });

      // set context menu in webview
      contextMenu({
        window: contents,
      });

      contents.on("before-input-event", (event, input) => {
        const { control, meta, key } = input;
        if (!control && !meta) return;
        if (key === "n") {
          console.log("cmd+n pressed");
          lastFocusedWindow = createWindow();
        }

        if (key === "t") {
          console.log("cmd+t pressed");
          lastFocusedWindow.webContents.send("new-tab-shortcut");
        }
        if (key === "w") {
          event.preventDefault();
          console.log("cmd+w pressed");
          lastFocusedWindow.webContents.send("close-tab-shortcut");
        }
        if (key === "]") {
          console.log("cmd+] pressed");
          lastFocusedWindow.webContents.send("next-tab-shortcut");
        }
        if (key === "[") {
          console.log("cmd+[ pressed");
          lastFocusedWindow.webContents.send("prev-tab-shortcut");
        }
      });
    }
  });

  // prevent background flickering
  app.commandLine.appendSwitch(
    "disable-backgrounding-occluded-windows",
    "true"
  );
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
