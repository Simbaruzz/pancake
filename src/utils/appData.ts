import { app } from 'electron';
import path from 'path';

/**
 * Path to the user data directory for the application.
 */
export const appDataDir: string = app.getPath('userData');

/**
 * Path to the logs directory inside the user data directory.
 */
export const logsDir: string = path.join(appDataDir, 'logs');

/**
 * Path to the configuration file inside the user data directory.
 */
export const configFile: string = path.join(appDataDir, 'config.json');

/**
 * Export all paths as a default object for convenience.
 */
const appData = {
  appDataDir,
  logsDir,
  configFile,
};

export default appData;
