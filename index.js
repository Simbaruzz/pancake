const { app, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');
const robot = require('@hurdlegroup/robotjs');
const packageJson = require('./package.json');

const APP_NAME = 'hypetype';
const APP_VERSION = packageJson.version;

const SHORTCUTS_DICT = {
    'Shift+Q': '⌀',
    'Shift+W': '',
    'Shift+E': '⌘',
    'Shift+R': '⌥',
    'Shift+T': '⇧',
    'Shift+Y': '⇪',

    'Ctrl+Alt+S': '⏎',
    'AltGr+S': '⌫',
};

let tray = null;

function createTray() {
    tray = new Tray(path.join(__dirname, 'icon-Template.png'));

    tray.setToolTip(`${APP_NAME}`);
    tray.setContextMenu(createMenu());
}

function registerShortcuts() {
    Object.keys(SHORTCUTS_DICT).forEach((key) => {
        const value = SHORTCUTS_DICT[key];

        console.log('Registering global shortcut:', key, 'for value:', value);

        globalShortcut.register(key, () => {
            pasteSpecialString(value);
        });
    });
}

function pasteSpecialString(stringToBePasted) {
    console.log('Pasting special string:', stringToBePasted);

    // Type the string at the current cursor position
    robot.typeString(stringToBePasted);
}

function createMenu() {
    const items = Object.keys(SHORTCUTS_DICT).map((key) => {
        const value = SHORTCUTS_DICT[key];

        return {
            label: `${value}`,
            accelerator: key,
            click: () => {
                pasteSpecialString(value);
            }
        };
    });

    const menu = Menu.buildFromTemplate([
        {
            label: `${APP_NAME} v${APP_VERSION}`,
        },
        {
            type: 'separator'
        },
        {
            label: 'Click to paste',
            enabled: false
        },
        ...items,
        {
            type: 'separator'
        },
        {
            label: 'Quit',
            click: () => {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    return menu;
}

app.whenReady().then(() => {
    createTray();
    registerShortcuts();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
