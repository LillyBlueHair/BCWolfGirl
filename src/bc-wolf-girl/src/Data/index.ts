import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DataKeyName } from "../Definition";
import { PermissionUtilities } from "./PermissionUtilities";
import { OutfitUtilities } from "./OutfitUtilities";
import { Validate, defaultValue } from "./DefaultValue";
import { PointsUtilities } from "./PointUtilities";
import { ArousalUtilities } from "./ArousalUtilities";
import { StatUtilities } from "./StatUtilities";

export class DataManager {
    private static _instance: DataManager | undefined = undefined;
    private _data: Partial<WolfGrilData> = {};
    private _permission: PermissionUtilities;
    private _outfit: OutfitUtilities;
    private _points: PointsUtilities;
    private _arousal: ArousalUtilities;
    private _stat: StatUtilities;

    constructor(player: PlayerCharacter) {
        this.load(player);
        this._permission = new PermissionUtilities(this);
        this._outfit = new OutfitUtilities(this);
        this._points = new PointsUtilities(this);
        this._arousal = new ArousalUtilities(this);
        this._stat = new StatUtilities(this);
    }

    public static get instance(): DataManager {
        return this._instance as DataManager;
    }

    public static get permission(): PermissionUtilities {
        return this.instance._permission;
    }

    public static get outfit(): OutfitUtilities {
        return this.instance._outfit;
    }

    public static get points(): PointsUtilities {
        return this.instance._points;
    }

    public static get arousal(): ArousalUtilities {
        return this.instance._arousal;
    }

    public static get statistics(): StatUtilities {
        return this.instance._stat;
    }

    public get data(): WolfGrilData {
        return this._data as WolfGrilData;
    }

    public static init(mod: ModSDKModAPI, msg?: string): void {
        const load_then_message = (C: PlayerCharacter | null | undefined) => {
            if (this._instance) return;
            if (C) this._instance = new DataManager(C);
            if (msg) console.log(msg);
        }

        mod.hookFunction('LoginResponse', 1, (args, next) => {
            next(args);
            load_then_message(args[0] as PlayerCharacter);
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

    load(C: PlayerCharacter) {
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