import fs from 'fs';
// import open from 'open';
import appData from './appData.js';
import logger from './logger.js';

// logger.info('appData: ' + JSON.stringify(appData));
// logger.info('appData.appDataDir: ' + appData.appDataDir);
// logger.info('appData.logsDir: ' + appData.logsDir);
// logger.info('appData.configFile: ' + appData.configFile);

const configFile = appData.configFile;

const defaultConfig = `{
  "Shift+Alt+X": "",
  "Shift+Alt+C": "⌘",
  "Shift+Alt+[": "←",
  "Shift+Alt+]": "→"
}`;

/**
 * Reads the configuration file. If it doesn't exist, creates it with a default configuration.
 * @returns An object containing the parsed configuration data.
 */
const getConfig = async (): Promise<Record<string, string>> => {
  let data: Record<string, string> = {};

  logger.info('Loading config file: ' + configFile);

  if (!fs.existsSync(configFile)) {
    logger.info(
      'Config file not found. Creating a new one with default configuration.'
    );
    fs.writeFileSync(configFile, defaultConfig, { encoding: 'utf-8' });
  }

  try {
    const fileData = fs.readFileSync(configFile, 'utf-8');
    data = JSON.parse(fileData);

    logger.info(fileData);
  } catch (e) {
    logger.error('Error loading config file:', e);
  }

  return JSON.parse(defaultConfig);

  return data;
};

/**
 * Opens the configuration file in the default editor.
 */
const editConfig = (): void => {
  // open(appData.configFile);
};

export default {
  get: getConfig,
  edit: editConfig,
};
