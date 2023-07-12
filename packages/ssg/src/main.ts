export { render } from './renderThread.js';
import { watch } from 'chokidar';

import { glob } from 'glob';

type WatchCallback = (target: string, changeType: string) => void;

class SSG {
  private _watchTargets: Map<
    string,
    {
      watching: boolean;
      callback: WatchCallback;
    }
  > = new Map();

  private _config: any;

  constructor(config: any) {
    this._config = config(this);

    if (config.watch) {
      this.setupWatch(config.watch);
    } else {
      for (const target of this._watchTargets.keys()) {
        glob([target])
          .then((files) => {
            for (const file of files) {
              console.log(
                this._watchTargets.get(target)?.callback(file, 'add')
              );
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
    console.log('SSG');
  }

  addWatchTarget(target: any, callback: WatchCallback) {
    if (this._watchTargets.has(target)) {
      return;
    }
    this._watchTargets.set(target, {
      watching: false,
      callback,
    });
    // this.setupWatch(target);
  }

  setupWatch(target: string) {
    const targetInfo = this._watchTargets.get(target);
    if (!targetInfo) {
      return;
    }
    if (targetInfo.watching) {
      return;
    }
    targetInfo.watching = true;
    const watcher = watch(target, {
      ignoreInitial: false,
    });
    // if (this._config?.watch) {
    watcher.on('all', (event, path) => {
      targetInfo.callback(path, event);
    });
    // } else {
    //   watcher.once('all', (event, path) => {
    //     targetInfo.callback(path, event);
    //   });
    // }
  }
}

export const ssg = (config: any) => {
  new SSG(config);
};
