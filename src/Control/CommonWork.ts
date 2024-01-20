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



interface CheckWorkMessage {
    mode: "local" | "chat" | "action";
    passed: string;
    failed: string;
}

export class CheckWork extends TimedWork {
    readonly _check: (player: Character) => boolean;
    readonly message?: CheckWorkMessage;
    constructor(check: () => boolean, message?: CheckWorkMessage) {
        super();
        this._check = check;
        this.message = message;
    }

    run(player: Character): TimedWorkState {
        const checked = this._check(player);

        if (this.message) {
            const func = (() => {
                if (this.message.mode === "local") return ChatRoomAction.instance.LocalAction;
                if (this.message.mode === "chat") return ChatRoomAction.instance.SendChat;
                return ChatRoomAction.instance.SendAction;
            })()
            if (checked) func(this.message.passed);
            else func(this.message.failed)
        }
        return checked ? TimedWorkState.finished : TimedWorkState.interrupted;
    }
}
