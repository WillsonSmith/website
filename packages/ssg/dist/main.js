export { render } from './renderThread.js';
import { watch } from 'chokidar';
import { glob } from 'glob';
class SSG {
    constructor(config) {
        this._watchTargets = new Map();
        this._config = config(this);
        if (this._config.watch) {
            // this.setupWatch(config.watch);
            for (const target of this._watchTargets.keys()) {
                this.setupWatch(target);
            }
        }
        else {
            for (const target of this._watchTargets.keys()) {
                glob([target])
                    .then((files) => {
                    for (const file of files) {
                        this._watchTargets.get(target)?.callback(file, 'add');
                    }
                })
                    .catch((error) => {
                    console.error(error);
                });
            }
        }
    }
    addWatchTarget(target, callback) {
        if (this._watchTargets.has(target)) {
            return;
        }
        this._watchTargets.set(target, {
            watching: false,
            callback,
        });
        // this.setupWatch(target);
    }
    setupWatch(target) {
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
export const ssg = (config) => {
    new SSG(config);
};
