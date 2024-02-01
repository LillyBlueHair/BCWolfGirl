import { IMessage, IMessageMode, ParseMessage } from "./Message";
import { TimedWork, TimedWorkState } from "./Worker";


export class DelayWork extends TimedWork {
    _timeout: number;
    first_run: boolean = true;
    constructor(delay: number) {
        super();
        this._timeout = delay;
    }

    run(player: Character): TimedWorkState {
        if (this.first_run) {
            this.first_run = false;
            this._timeout = Date.now() + this._timeout;
        }

        if (Date.now() < this._timeout) return TimedWorkState.running;
        return TimedWorkState.finished;
    }
}

interface CheckWorkState {
    passed: boolean;
    state: TimedWorkState;
}

interface CheckWorkMessage {
    mode: IMessageMode;
    passed: string;
    failed: string;
}

export class CheckWork extends TimedWork {
    readonly _check: (player: Character) => CheckWorkState;
    readonly message?: CheckWorkMessage | ((player: Character, result: CheckWorkState) => IMessage | undefined);
    constructor(check: (player: Character) => CheckWorkState, message?: CheckWorkMessage | ((player: Character, result: CheckWorkState) => IMessage | undefined)) {
        super();
        this._check = check;
        this.message = message;
    }

    run(player: Character): TimedWorkState {
        const checked = this._check(player);

        if (this.message) {
            const rmessage: IMessage | undefined = (() => {
                if (typeof this.message === "function") return this.message(player, checked);
                if (checked.passed) return { mode: this.message.mode, msg: this.message.passed };
                return { mode: this.message.mode, msg: this.message.failed };
            })()
            if (rmessage) {
                ParseMessage(rmessage, { player });
            }
        }
        return checked.state;
    }

    static readonly Accepted: CheckWorkState = { state: TimedWorkState.finished, passed: true };
    static readonly Continue: CheckWorkState = { state: TimedWorkState.finished, passed: false };
    static readonly Rejected: CheckWorkState = { state: TimedWorkState.interrupted, passed: false };
    static readonly Stop: CheckWorkState = { state: TimedWorkState.interrupted, passed: true };
}

export class CommonWork {
    readonly _callback: (player: Character) => void | TimedWorkState;

    constructor(callback: (player: Character) => void | TimedWorkState) {
        this._callback = callback;
    }

    run(player: Character): TimedWorkState {
        const result = this._callback(player);
        if (result === undefined) return TimedWorkState.finished;
        return result;
    }
}