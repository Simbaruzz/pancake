import AutoLaunch from 'auto-launch';
import { app } from 'electron';

/**
 * Compose path to app.
 */
const appPath: string = app.getPath('exe').replace(/\.app\/Content.*/, '.app');

/**
 * Create an instance of AutoLaunch for the app.
 */
const launch = new AutoLaunch({
  name: 'hypetype',
  path: appPath,
  isHidden: false,
});

/**
 * Toggles the launch state of the app at login.
 * If currently disabled, enables it; otherwise, disables it.
 */
const toggle = async (): Promise<void> => {
  const enabled = await launch.isEnabled();
  if (!enabled) {
    await launch.enable();
  } else {
    await launch.disable();
  }
};

export default {
  toggle,
};
