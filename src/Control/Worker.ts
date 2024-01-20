export enum TimedWorkState {
    worked, finished, interrupted
}
export abstract class TimedWork {
    abstract run(player: Character): TimedWorkState;
}

type TimerState = 'working' | 'paused';

export class TimedWorker {
    private readonly works: TimedWork[] = [];
    private readonly _timer;

    private _state: TimerState = 'working';
    constructor(readonly interval: number = 1000) {
        this._timer = setInterval(() => {
            if (Player && this.works.length > 0 && this._state === 'working') {
                const state = this.works[0].run(Player);
                if (state === TimedWorkState.finished) {
                    this.works.shift();
                } else if (state === TimedWorkState.interrupted) {
                    this.works.length = 0;
                }
            }
        }, interval);
    }

    pause() {
        this._state = 'paused';
    }

    resume() {
        this._state = 'working';
    }

    push(work: TimedWork | TimedWork[]) {
        if (Array.isArray(work)) this.works.push(...work);
        else this.works.push(work);
    }

    private static _global: TimedWorker | undefined;

    static init() {
        if (TimedWorker._global) return;
        TimedWorker._global = new TimedWorker();
    }

    static get global(): TimedWorker {
        return TimedWorker._global as TimedWorker;
    }
}
