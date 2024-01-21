import { ChatRoomAction } from "../utils/ChatMessages";
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

        if (Date.now() < this._timeout) return TimedWorkState.worked;
        return TimedWorkState.finished;
    }
}

interface CheckWorkState {
    passed: boolean;
    state: TimedWorkState;
}

interface CheckWorkMessage {
    mode: "local" | "chat" | "action";
    passed: string;
    failed: string;
}

interface CheckWorkMessageResult {
    mode: "local" | "chat" | "action" | "chat-action";
    msg: string;
}

export class CheckWork extends TimedWork {
    readonly _check: (player: Character) => CheckWorkState;
    readonly message?: CheckWorkMessage | ((player: Character, result: CheckWorkState) => CheckWorkMessageResult | undefined);
    constructor(check: (player: Character) => CheckWorkState, message?: CheckWorkMessage | ((player: Character, result: CheckWorkState) => CheckWorkMessageResult | undefined)) {
        super();
        this._check = check;
        this.message = message;
    }

    run(player: Character): TimedWorkState {
        const checked = this._check(player);

        if (this.message) {
            const rmessage: CheckWorkMessageResult | undefined = (() => {
                if (typeof this.message === "function") return this.message(player, checked);
                if (checked) return { mode: this.message.mode, msg: this.message.passed };
                return { mode: this.message.mode, msg: this.message.failed };
            })()
            if (rmessage) {
                const func = (() => {
                    if (rmessage.mode === "local") return ChatRoomAction.instance.LocalAction;
                    if (rmessage.mode === "chat") return ChatRoomAction.instance.SendChat;
                    if (rmessage.mode === "chat-action") return (msg: string) => ChatRoomAction.instance.SendAction(`"${msg}"`);
                    return ChatRoomAction.instance.SendAction;
                })()
                if (checked.passed) func(rmessage.msg);
                else func(rmessage.msg)
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
    readonly _callback: (player: Character) => void;
    constructor(callback: (player: Character) => void) {
        this._callback = callback;
    }

    run(player: Character): TimedWorkState {
        this._callback(player);
        return TimedWorkState.finished;
    }
}