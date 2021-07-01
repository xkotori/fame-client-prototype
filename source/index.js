/**
 * Prototyp zewnętrznej aplikacji do obejrzenia wydarzeń FAME MMA
 */

const WindowsManager = require("./windowsManager");
const OBSProcessManager = require("./OBSProcessManager");

const {app} = require("electron");

app.on("ready", () => {
    const windows = new WindowsManager;
    const window = windows.createWindow("test");
    
    if (window)
        new OBSProcessManager(window.browser), windows.setWindowURL(window.id, "https://www.google.com");
});