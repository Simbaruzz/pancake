import Autolaunch from 'auto-launch';
import { app } from 'electron';

/**
 * Compose path to app
 */
const appPath = app.getPath('exe').replace(/\.app\/Content.*/, '.app');

/**
 * Get launch instance
 */
const launch = new Autolaunch({
  name: 'hypetype',
  path: appPath,
  isHidden: false,
});

/**
 * Toggle launch state
 */
const toggle = () => {
  launch.isEnabled().then((enabled) => {
    if (!enabled) {
      launch.enable();
    } else {
      launch.disable();
    }
  });
};

export default {
  toggle,
};
