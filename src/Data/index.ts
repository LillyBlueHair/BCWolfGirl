import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DataKeyName } from "../Definition";
import { PermissionUtilities } from "./PermissionUtilities";
import { OutfitUtilities } from "./OutfitUtilities";
import { Validate, defaultValue } from "./DefaultValue";

export class DataManager {
    private static _instance: DataManager | undefined = undefined;
    private _data: Partial<WolfGrilData> = {};

    public static get instance(): DataManager {
        return this._instance as DataManager;
    }

    public static get permission(): PermissionUtilities {
        return new PermissionUtilities(this.instance);
    }

    public static get outfit(): OutfitUtilities {
        return new OutfitUtilities(this.instance);
    }

    public get data(): WolfGrilData {
        return this._data as WolfGrilData;
    }

    public static init(mod: ModSDKModAPI, msg?: string): void {
        if (this._instance) return;
        this._instance = new DataManager();

        const load_then_message = (C: Character | null | undefined) => {
            if (C) DataManager.instance.load(C);
            if (msg) console.log(msg);
        }

        mod.hookFunction('LoginResponse', 1, (args, next) => {
            next(args);
            load_then_message(args[0] as Character);
        });

        if (Player && Player.MemberNumber) {
            load_then_message(Player);
        }
    }

    private deserialize(str: string | undefined) {
        if (str === undefined) {
            Object.assign(this._data, defaultValue());
            return;
        }

        let d = LZString.decompressFromBase64(str);
        let data = {};

        try {
            let decoded = JSON.parse(d);
            data = decoded;
        } catch { }

        this._data = Validate(data);
    }

    serialize(): string {
        return LZString.compressToBase64(JSON.stringify(this._data));
    }

    load(C: Character) {
        const raw_data = C.ExtensionSettings[DataKeyName]
        this.deserialize(raw_data);
    }

    save() {
        if (Player && Player.ExtensionSettings) {
            Player.ExtensionSettings[DataKeyName] = this.serialize();
            ServerPlayerExtensionSettingsSync(DataKeyName);
        }
    }
}