import { autoUpdater, UpdateInfo, ProgressInfo } from 'electron-updater';
import logger from './logger.js';

/**
 * Check for updates every hour.
 */
const CHECK_FOR_UPDATES_INTERVAL = 60 * 60 * 1000;

/**
 * AutoUpdater events handling.
 */

// Event: Checking for updates
autoUpdater.on('checking-for-update', () => {
  logger.debug('Checking for update');
});

// Event: Error during update process
autoUpdater.on('error', (error: Error) => {
  logger.error('Error while checking for updates', error);
});

// Event: Update available
autoUpdater.on('update-available', (updateInfo: UpdateInfo) => {
  logger.debug('Update is available:', updateInfo);
});

// Event: No updates available
autoUpdater.on('update-not-available', (updateInfo: UpdateInfo) => {
  logger.debug('No updates are available', updateInfo);
});

// Event: Download progress
autoUpdater.on('download-progress', (progressInfo: ProgressInfo) => {
  const logMessage = `speed ${progressInfo.bytesPerSecond} b/s; progress ${progressInfo.percent}%; downloaded ${progressInfo.transferred} out of ${progressInfo.total} bytes`;
  logger.debug(logMessage);
});

// Event: Update downloaded
autoUpdater.on('update-downloaded', (updateInfo: UpdateInfo) => {
  logger.debug('Update is ready', updateInfo);

  /**
   * Uncomment the following string to force quit app and install update
   */
  autoUpdater.quitAndInstall();
});

/**
 * Check for updates on script start.
 *
 * Silently: autoUpdater.checkForUpdates();
 * With notification: autoUpdater.checkForUpdatesAndNotify();
 */
autoUpdater.checkForUpdatesAndNotify();

/**
 * Check for updates at regular intervals.
 */
setInterval(() => {
  autoUpdater.checkForUpdatesAndNotify();
}, CHECK_FOR_UPDATES_INTERVAL);
