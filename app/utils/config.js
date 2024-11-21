import { exec } from 'child_process';
import appData from './appData.js';
import importFresh from 'import-fresh';
import open from 'open';
import fs from 'fs';

const defaultConfig = `module.exports = {
  'Shift+Alt+A': '',
  'Shift+Alt+C': '⌘',
};
`;

const getConfig = function () {
  let data = {};

  if (!fs.existsSync(appData.configFile)) {
    fs.writeFileSync(appData.configFile, defaultConfig);
  }

  try {
    data = importFresh(appData.configFile);
  } catch (e) {
    console.error('Error loading config file:', e);
  }

  return data;
};

const editConfig = function () {
  open(appData.configFile);
};

export default {
  get: getConfig,
  edit: editConfig,
};
