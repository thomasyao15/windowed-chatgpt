const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onFocusTextbox: (callback) => ipcRenderer.on("focus-textbox", callback),
});
