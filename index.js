require("update-electron-app")();

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

    const template = [
        {
            label: "ChatGPT",
            submenu: [
                {
                    label: "Github",
                    click: () =>
                        shell.openExternal(
                            "https://github.com/thomasyao15/windowed-chatgpt"
                        ),
                },
                {type: "separator"},
                {role: "hide"},
                {role: "hideothers"},
                {role: "unhide"},
                {type: "separator"},
                {role: "quit"},
            ],
        },
        {
            label: "Edit",
            submenu: [
                {role: "undo"},
                {role: "redo"},
                {type: "separator"},
                {role: "cut"},
                {role: "copy"},
                {role: "paste"},
                {role: "pasteAndMatchStyle"},
                {role: "delete"},
                {role: "selectAll"},
            ],
        },
        {
            label: "View",
            submenu: [
                {role: "toggleDevTools"},
                {type: "separator"},
                {role: "resetZoom"},
                {role: "zoomIn"},
                {role: "zoomOut"},
                {type: "separator"},
                {role: "togglefullscreen"},
            ],
        },
        {
            label: "Window",
            submenu: [
                {
                    label: "New Window",
                    accelerator: "CmdOrCtrl+N",
                    click: () => createWindow(),
                },
                {role: "reload"},
                {role: "forceReload"},
                {role: "close"},
                {type: "separator"},
                {role: "minimize"},
                {role: "zoom"},
                {type: "separator"},
                {role: "front"},
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

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
                const {control, meta, key} = input;
                if (!control && !meta) return;
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
                if (key === "i") {
                    console.log("cmd+i pressed");
                    lastFocusedWindow.webContents.send("focus-textbox");
                }
                if (key === "f") {
                    console.log("cmd+f pressed");
                    lastFocusedWindow.webContents.send("toggle-widescreen");
                }
                if (key === "b") {
                    console.log("cmd+b pressed");
                    lastFocusedWindow.webContents.send("toggle-sidebar");
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
