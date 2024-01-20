import { ChatRoomAction } from "../utils/ChatMessages";
import { TimedWork, TimedWorkState } from "./Worker";


export class DelayWork extends TimedWork {
    _delay: number;
    constructor(delay: number) {
        super();
        this._delay = delay;
    }

    run(player: Character): TimedWorkState {
        this._delay--;
        return this._delay > 0 ? TimedWorkState.worked : TimedWorkState.finished;
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
                if (this.message.mode === "chat") return ChatRoomAction.instance.ServerChat;
                return ChatRoomAction.instance.ServerAction;
            })()
            if (checked) func(this.message.passed);
            else func(this.message.failed)
        }
        return checked ? TimedWorkState.finished : TimedWorkState.interrupted;
    }
}
