import { ExtractMemberNumber } from "../utils/Character";
import { ParseMessage } from "./Message";
import { IMessageMode } from "./Message";
import { IMessage } from "./Message";
import { TimedWork } from "./Worker";
import { TimedWorkState } from "./Worker";

export class MessageWork extends TimedWork {
    private _target?: number;
    constructor(readonly mode: IMessageMode, readonly message: string, readonly target?: number | Character) {
        super();
        this._target = target ? ExtractMemberNumber(target) : undefined;
    }

    run(player: Character): TimedWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        ParseMessage({ mode: this.mode, msg: this.message }, { player, target });
        return TimedWorkState.finished;
    }
}

interface WaitResponseWorkOptions {
    accept: RegExp,
    reject: RegExp,
    accept_msg?: IMessage,
    reject_msg?: IMessage
}

export class WaitResponseWork extends TimedWork {
    private _target: number;
    private _options: WaitResponseWorkOptions;

    private _timeout: number;
    private _last_query: number;

    private _then: (player: Character, target: Character) => void;

    private first_run: boolean = true;

    constructor(target: number | Character, options: WaitResponseWorkOptions, timeout: number, then: (player: Character, target: Character) => void,) {
        super();
        this._target = typeof target === "number" ? target : target.MemberNumber;
        this._options = options;
        this._last_query = 0;
        this._timeout = timeout;
        this._then = then;
    }

    run(player: Character): TimedWorkState {
        if (this.first_run) {
            this.first_run = false;
            this._timeout = Date.now() + this._timeout;
            this._last_query = Date.now();
        }

        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        if (!target) return TimedWorkState.interrupted;
        if (ChatRoomChatLog == null) return TimedWorkState.interrupted;

        let result: 'accept' | 'reject' | 'default' | 'timeout' = 'default';
        for (const L of ChatRoomChatLog.filter(m => m.SenderMemberNumber === this._target && m.Time > this._last_query)) {
            if (this._options.accept.test(L.Original)) {
                result = 'accept';
                break;
            } else if (this._options.reject.test(L.Original)) {
                result = 'reject';
                break;
            }
            this._last_query = Math.max(this._last_query, L.Time);
        };

        if (result === 'default' && Date.now() > this._timeout) {
            result = 'timeout';
        }

        if (result === 'accept' && this._options.accept_msg) {
            ParseMessage(this._options.accept_msg);
            return TimedWorkState.finished;
        }

        if (result === 'reject' && this._options.reject_msg) {
            ParseMessage(this._options.reject_msg);
            return TimedWorkState.finished;
        }

        if (result === 'timeout') {
            this._then(player, target);
            return TimedWorkState.finished;
        }
        return TimedWorkState.running;
    }
}
