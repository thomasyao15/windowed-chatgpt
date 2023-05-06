require("update-electron-app")();

const Nucleus = require("nucleus-analytics");
const robot = require("robotjs");

const path = require("path");
const {
  app,
  nativeImage,
  BrowserWindow,
  Menu,
  globalShortcut,
  shell,
} = require("electron");
const contextMenu = require("electron-context-menu");

const image = nativeImage.createFromPath(
  path.join(__dirname, `images/newiconTemplate.png`)
);

app.on("ready", () => {
  Nucleus.init("638d9ccf4a5ed2dae43ce122");

  const mainWindow = new BrowserWindow({
    icon: image,
    transparent: path.join(__dirname, `images/iconApp.png`),
    webPreferences: {
      webviewTag: true,
      preload: path.join(__dirname, "preload.js"),
    },
    width: 2050,
    height: 1440,
    autoHideMenuBar: false,
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // // Register the global shortcut
  // const shortcutRegistered = globalShortcut.register(
  //   "CommandOrControl+Shift+g",
  //   () => {
  //     if (mainWindow.isVisible()) {
  //       mainWindow.hide();
  //     } else {
  //       mainWindow.show();
  //       mainWindow.focus();
  //       // mainWindow.webContents.send("focus-textbox");
  //     }
  //   }
  // );

  // if (!shortcutRegistered) {
  //   console.log("Shortcut registration failed");
  // }

  mainWindow.on("focus", () => {
    mainWindow.webContents.send("focus-textbox");
  });

  mainWindow.on("ready", () => {
    const menu = new Menu();
    Menu.setApplicationMenu(menu);

    console.log("Standalone app is ready.");
  });

  app.on("web-contents-created", (e, contents) => {
    if (contents.getType() == "webview") {
      contents.on("dom-ready", () => {
        // Simulate a 'tab' keypress (this focuses the webview properly, so textbox can be focused)
        mainWindow.show();
        mainWindow.focus();
        robot.keyTap("tab");

        setTimeout(function () {
          mainWindow.webContents.send("focus-textbox");
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

      // we can't set the native app menu with "menubar" so need to manually register these events
      // register cmd+c/cmd+v events
      contents.on("before-input-event", (event, input) => {
        const { control, meta, key } = input;
        if (!control && !meta) return;
        if (key === "c") contents.copy();
        if (key === "v") contents.paste();
        if (key === "a") contents.selectAll();
        if (key === "z") contents.undo();
        if (key === "y") contents.redo();
        if (key === "q") app.quit();
        if (key === "r") contents.reload();
      });
    }
  });

  // if (process.platform == "darwin") {
  //   // restore focus to previous app on hiding
  //   mainWindow.on("after-hide", () => {
  //     mainWindow.hide();
  //   });
  // }

  // open links in new window
  // app.on("web-contents-created", (event, contents) => {
  //   contents.on("will-navigate", (event, navigationUrl) => {
  //     event.preventDefault();
  //     shell.openExternal(navigationUrl);
  //   });
  // });

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
