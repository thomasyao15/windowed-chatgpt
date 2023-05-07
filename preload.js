const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onFocusTextbox: (callback) => ipcRenderer.on("focus-textbox", callback),
  onNewTabShortcut: (callback) => ipcRenderer.on("new-tab-shortcut", callback),
  onCloseTabShortcut: (callback) =>
    ipcRenderer.on("close-tab-shortcut", callback),
  onNextTabShortcut: (callback) =>
    ipcRenderer.on("next-tab-shortcut", callback),
  onPrevTabShortcut: (callback) =>
    ipcRenderer.on("prev-tab-shortcut", callback),
});
