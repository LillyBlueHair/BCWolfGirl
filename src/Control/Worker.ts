export enum TimedWorkState {
    running, finished, interrupted
}
export abstract class TimedWork {
    abstract run(player: Character): TimedWorkState;
}

type TimerState = 'working' | 'paused';

interface TimedWorkSuite {
    description: string;
    works: TimedWork[];
}

export class TimedWorker {
    private readonly work_suites: TimedWorkSuite[] = [];
    private readonly _timer;

    private _state: TimerState = 'working';
    constructor(readonly time_reso: number) {
        this._timer = setInterval(() => {
            do {
                if (Player && this.work_suites.length > 0 && this._state === 'working') {
                    const cur_suite = this.work_suites[0];
                    if (cur_suite.works.length === 0) {
                        this.work_suites.shift();
                        continue;
                    }

                    const state = cur_suite.works[0].run(Player);
                    if (state === TimedWorkState.finished) {
                        cur_suite.works.shift();
                    } else if (state === TimedWorkState.interrupted) {
                        this.work_suites.shift();
                    }
                }
                break;
            } while (true);
        }, time_reso);
    }

    skip_until(pred: (t: TimedWorkSuite) => boolean) {
        do {
            if (this.work_suites.length === 0) return;
            const cur_suite = this.work_suites[0];
            if (cur_suite.works.length === 0)
                this.work_suites.shift();
            if (pred(cur_suite))
                cur_suite.works.shift();
            else return;
        } while (true);
    }

    pause() {
        this._state = 'paused';
    }

    resume() {
        this._state = 'working';
    }

    push(work: TimedWorkSuite) {
        this.work_suites.push(work);
    }

    insert_after_first(work: TimedWorkSuite) {
        if (this.work_suites.length === 0) {
            this.work_suites.push(work);
            return;
        } else {
            this.work_suites.splice(1, 0, work);
        }
    }

    private static _global: TimedWorker | undefined;

    static init(time_reso: number) {
        if (TimedWorker._global) return;
        TimedWorker._global = new TimedWorker(time_reso);
    }

    static get global(): TimedWorker {
        return TimedWorker._global as TimedWorker;
    }
}
