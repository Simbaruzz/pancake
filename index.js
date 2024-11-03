const { app, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');
const robot = require('@hurdlegroup/robotjs');

let tray = null; //присвоили пустое значение 

function createTray() {
    tray = new Tray(path.join(__dirname, 'icon-Template.png')); // Make sure you have this file
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            click: () => {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);
    tray.setToolTip('hypetype');
    tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
    createTray();

    globalShortcut.register('Shift+Q', () => {
        pasteSpecialString();
    });
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});



// Function to simulate pasting text
function pasteSpecialString() {
    const specialString = "⌀";

    console.log('Pasting special string:', specialString);

    // Type the string at the current cursor position
    robot.typeString(specialString);
}

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
