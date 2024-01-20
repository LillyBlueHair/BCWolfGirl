import { ModSDKModAPI } from "bondage-club-mod-sdk";

export class FuturisticBypass {
    private _state: boolean = false;

    get on(): boolean {
        return this._state;
    }

    set on(value: boolean) {
        this._state = value;
    }

    static instance: FuturisticBypass;

    static init(mod: ModSDKModAPI) {
        FuturisticBypass.instance = new FuturisticBypass(mod);
    }

    constructor(mod: ModSDKModAPI) {
        mod.hookFunction('InventoryItemFuturisticValidate', 2, (args, next) => {
            if (this._state) args[2] = true;
            next(args);
        });
    }
}