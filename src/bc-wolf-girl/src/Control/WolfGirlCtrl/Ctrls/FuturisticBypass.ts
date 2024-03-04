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

    static init(mod: ModSDKModAPI, lateHook: (callback: () => void) => void) {
        FuturisticBypass.instance = new FuturisticBypass(mod);
    }

    constructor(mod: ModSDKModAPI) {
        mod.hookFunction('InventoryItemFuturisticValidate', 2, (args, next) => {
            if (this._state) return "";
            return next(args);
        });

        mod.hookFunction('ExtendedItemValidate', 2, (args, next) => {
            const item = args[2] as Item;
            if (item.Asset.Name.startsWith("Futuristic") && this._state) return "";
            return next(args);
        })
    }
}