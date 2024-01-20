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
            if (checked) ChatRoomAction.instance.LocalAction(this.message.passed);
            else ChatRoomAction.instance.LocalAction(this.message.failed)
        }
        return checked ? TimedWorkState.finished : TimedWorkState.interrupted;
    }
}
