import { ExtractMemberNumber } from "../utils/Character";
import { ParseMessage } from "./Message";
import { IMessage } from "./Message";
import { TimedWork } from "./Worker";
import { TimedWorkState } from "./Worker";

export class MessageWork extends TimedWork {
    constructor(readonly message: IMessage, readonly config?: { target?: number | Character, args?: Record<string, any> }) {
        super();
    }

    run(player: PlayerCharacter): TimedWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this.config?.target);
        ParseMessage(this.message, { player, target }, this.config?.args);
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

    private _then: (player: PlayerCharacter, target: Character) => void;

    private first_run: boolean = true;

    constructor(target: number | Character, options: WaitResponseWorkOptions, timeout: number, then: (player: PlayerCharacter, target: Character) => void,) {
        super();
        this._target = ExtractMemberNumber(target);
        this._options = options;
        this._last_query = 0;
        this._timeout = timeout;
        this._then = then;
    }

    run(player: PlayerCharacter): TimedWorkState {
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
