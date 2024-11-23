import { app, Tray, Menu, globalShortcut } from 'electron';
import * as path from 'path';
import robot from '@jitsi/robotjs';
// import robot from 'robotjs';
// import { version as APP_VERSION } from '../package.json' assert { type: 'json' };
// import openBrowser from './utils/opener';
import autolaunch from './utils/autolaunch.js';
import appData from './utils/appData.js';
import logger from './utils/logger.js';

import config from './utils/config.js';
import isDev from 'electron-is-dev';
import * as fs from 'fs';

const __dirname = import.meta.dirname;

const APP_NAME = 'hypetype';
let SHORTCUTS_DICT: Record<string, string> = {};
let tray: Tray;

async function createTray() {
  tray = new Tray(path.join(__dirname, '../assets/icon-Template.png'));

  tray.setToolTip(`${APP_NAME}`);
  tray.setContextMenu(await createMenu());
  // registerShortcuts();

  fs.watchFile(appData.configFile, async () => {
    logger.log('Config file changed');
    tray.setContextMenu(await createMenu());
    // registerShortcuts();
  });
}

async function registerShortcuts() {
  globalShortcut.unregisterAll();

  logger.log(Object.keys(SHORTCUTS_DICT));
  logger.log(JSON.stringify(Object.keys(SHORTCUTS_DICT)));

  for await (const key of Object.keys(SHORTCUTS_DICT)) {
    const value = SHORTCUTS_DICT[key];

    if (globalShortcut.isRegistered(key)) {
      logger.log(`Shortcut already registered: ${key}`);
      continue;
    }

    logger.log(`Registering global shortcut: ${key} for value ${value}`);

    globalShortcut.register(key, () => {
      pasteSpecialString(value);
    });
  }

  for await (const key of Object.keys(SHORTCUTS_DICT)) {
    if (!globalShortcut.isRegistered(key)) {
      logger.error(`Failed to register shortcut: ${key}`);
    }
  }
}

function pasteSpecialString(stringToBePasted: string) {
  logger.log(`Pasting special string: ${stringToBePasted}`);
  robot.typeString(stringToBePasted);
}

async function createMenu() {
  SHORTCUTS_DICT = await config.get();

  logger.info('SHORTCUTS_DICT:');
  logger.info(JSON.stringify(SHORTCUTS_DICT));
  registerShortcuts();

  const items = Object.keys(SHORTCUTS_DICT).map((key) => ({
    label: `${SHORTCUTS_DICT[key]}`,
    accelerator: key,
    click: () => pasteSpecialString(SHORTCUTS_DICT[key]),
  }));

  return Menu.buildFromTemplate([
    {
      // label: `${APP_NAME} v${APP_VERSION}`,
      label: `${APP_NAME}`,
      // click: () => openBrowser('https://github.com/Simbaruzz/hypetype'),
    },
    { type: 'separator' },
    { label: 'Click to paste', enabled: false },
    ...items,
    { type: 'separator' },
    { label: 'Edit configuration', click: config.edit },
    {
      label: 'Open at Login',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: autolaunch.toggle,
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);
}

app.whenReady().then(async () => {
  try {
    logger.info('=== App started ===');

    await createTray();

    if (process.platform === 'darwin' && app.dock) app.dock.hide();

    // if (!isDev) import './utils/autoupdater';
  } catch (error) {
    logger.error(error);

    globalShortcut.unregisterAll();
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

process.on('uncaughtException', (err) => {
  logger.error(`uncaughtException: ${err}`);
});

process.on('unhandledRejection', (err) => {
  logger.error(`unhandledRejection: ${err}`);
});
