import { app, Tray, Menu, globalShortcut } from 'electron';
import path from 'path';
import robot from '@jitsi/robotjs';
import packageJson from './package.json' with { type: 'json' };
import openBrowser from './app/utils/opener.js';
import autolaunch from './app/utils/autolaunch.js';
import appData from './app/utils/appData.js';
import config from './app/utils/config.js';
import isDev from 'electron-is-dev';
import fs from 'fs';

const __dirname = import.meta.dirname;

const APP_NAME = 'hypetype';
const APP_VERSION = packageJson.version;

let SHORTCUTS_DICT = {};

// const SHORTCUTS_DICT = {
//   // 'Shift+Q': '⌀',
//   // 'Shift+W': '',
//   // 'Shift+E': '⌘',
//   // 'Shift+R': '⌥',
//   // 'Shift+T': '⇧',
//   // 'Shift+Y': '⇪',

//   'Ctrl+Alt+S': '⏎',
//   // 'AltGr+S': '⌫',
// };

let tray = null;

function createTray() {
  tray = new Tray(path.join(__dirname, 'icon-Template.png'));

  tray.setToolTip(`${APP_NAME}`);
  tray.setContextMenu(createMenu());

  fs.watchFile(appData.configFile, async (curr, prev) => {
    console.log('Config file changed');
    tray.setContextMenu(createMenu());
    registerShortcuts();
});
}

function registerShortcuts() {
  globalShortcut.unregisterAll();

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
  SHORTCUTS_DICT = config.get();

  console.log('SHORTCUTS_DICT:', SHORTCUTS_DICT);

  const items = Object.keys(SHORTCUTS_DICT).map((key) => {
    const value = SHORTCUTS_DICT[key];

    return {
      label: `${value}`,
      accelerator: key,
      click: () => {
        pasteSpecialString(value);
      },
    };
  });

  const menu = Menu.buildFromTemplate([
    {
      label: `${APP_NAME} v${APP_VERSION}`,
      click: () => {
        openBrowser('https://github.com/Simbaruzz/hypetype');
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Click to paste',
      enabled: false,
    },
    ...items,
    {
      type: 'separator',
    },
    {
      label: `Edit configuration`,
      click: config.edit,
    },
    {
      label: 'Open at Login',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: autolaunch.toggle,
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  return menu;
}

app.whenReady().then(async () => {
  try {
    createTray();
    registerShortcuts();

    /**
     * Don't show app in the dock
     */
    // app.dock.hide();

    if (!isDev) {
      require('./app/utils/autoupdater');
    }
  } catch (error) {
    console.error(error);

    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

/**
 * Catch runtime exceptions and rethrow them to "app's onready catch"
 */
process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err);
  //   log.error('uncaughtException');
  //   log.error(err.toString());
  // throw err;
});

process.on('unhandledRejection', (err) => {
  console.log('unhandledRejection', err);
  //   log.error('unhandledRejection');
  //   log.error(err.toString());
  // throw err;
});
