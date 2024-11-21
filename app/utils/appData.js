import { app } from 'electron';
import path from 'path';

const appData = app.getPath('userData');

export const appDataDir = appData;
export const logsDir = path.join(appData, 'logs');
export const configFile = path.join(appData, 'config.txt');

export default {
  appDataDir,
  logsDir,
  configFile,
};
