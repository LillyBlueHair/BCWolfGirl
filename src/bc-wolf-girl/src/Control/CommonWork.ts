import { OutfitItemType } from "bc-utilities";
import { IMessage, IMessageMode, ParseMessage } from "./Message";
import { OutfitItemsMap } from "./OutfitCtrl";
import { TimedWork, TimedWorkState } from "./Worker";
import { DefaultCheckOutfitItem } from "./OutfitCtrl/Utils";


export class DelayWork extends TimedWork {
    _timeout: number;
    first_run: boolean = true;
    constructor(delay: number) {
        super();
        this._timeout = delay;
    }

    run(player: PlayerCharacter): TimedWorkState {
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
    readonly _check: (player: PlayerCharacter) => CheckWorkState;
    readonly message?: CheckWorkMessage | ((player: PlayerCharacter, result: CheckWorkState) => IMessage | void);
    constructor(check: (player: PlayerCharacter) => CheckWorkState, message?: CheckWorkMessage | ((player: PlayerCharacter, result: CheckWorkState) => IMessage | void)) {
        super();
        this._check = check;
        this.message = message;
    }

    run(player: PlayerCharacter): TimedWorkState {
        const checked = this._check(player);

        if (this.message) {
            const rmessage: IMessage | void = (() => {
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
    readonly _callback: (player: PlayerCharacter) => void | TimedWorkState;

    constructor(callback: (player: PlayerCharacter) => void | TimedWorkState) {
        this._callback = callback;
    }

    run(player: PlayerCharacter): TimedWorkState {
        const result = this._callback(player);
        if (result === undefined) return TimedWorkState.finished;
        return result;
    }
}

export class CheckItemsWork extends TimedWork {
    _target: OutfitItemType[];
    constructor(target: (string | OutfitItemType)[], readonly callback: (player: PlayerCharacter, result: { missing: OutfitItemType[] }) => TimedWorkState | void, readonly checkLock?: boolean) {
        super();
        this._target = target.map(e => typeof e === "string" ? OutfitItemsMap.get(e) : e).filter(e => e !== undefined) as OutfitItemType[];
    }

    run(player: PlayerCharacter): TimedWorkState {
        const app_map = new Map(player.Appearance.map(e => [e.Asset.Group.Name, e]));
        const missing = this._target.filter(e => {
            const i = app_map.get(e.Asset.Group);
            if (!i) return false;
            return !DefaultCheckOutfitItem(i, e, this.checkLock);
        })

        const result = this.callback(player, { missing });
        if (result === undefined) return TimedWorkState.finished;
        return result;
    }
}