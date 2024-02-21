import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DataKeyName, FrequentDataKeyName } from "../Definition";
import { PermissionUtilities } from "./PermissionUtilities";
import { OutfitUtilities } from "./OutfitUtilities";
import { Validate } from "./DefaultValue";
import { PointsUtilities } from "./PointUtilities";
import { ArousalUtilities } from "./ArousalUtilities";
import { StatUtilities } from "./StatUtilities";
import { FrequentData, DefaultData, isDefaultDataKey, PickDefaultData, isFrequentDataKey, PickFrequenceData, DataKeys } from "./DataCategory";


function deserialize(str: (string | undefined)[]): WolfGrilData {
    const data = str.reduce((prev, cur) => {
        if (!cur) return prev;
        let d = LZString.decompressFromBase64(cur);
        try {
            let decoded = JSON.parse(d);
            return Object.assign(prev, decoded);
        } catch {
            return prev;
        }
    }, {} as Partial<WolfGrilData>);
    return Validate(data);
}

function serialize(data: FrequentData | DefaultData): string {
    return LZString.compressToBase64(JSON.stringify(data));
}

class SettingUtilities {
    constructor(private readonly _data: DataManager) { }

    query(key: keyof WolfGirlDataSettings) {
        return this._data.data.settings[key];
    }

    update(key: keyof WolfGirlDataSettings, value: WolfGirlDataSettings[typeof key]) {
        this._data.data.settings[key] = value;
        this._data.save("settings");
    }
}

export class DataManager {
    private static _instance: DataManager | undefined = undefined;
    private _data: Partial<WolfGrilData> = {};
    private _permission: PermissionUtilities;
    private _outfit: OutfitUtilities;
    private _points: PointsUtilities;
    private _arousal: ArousalUtilities;
    private _stat: StatUtilities;
    private _setting: SettingUtilities;

    constructor(player: PlayerCharacter) {
        this.load(player);
        this._permission = new PermissionUtilities(this);
        this._outfit = new OutfitUtilities(this);
        this._points = new PointsUtilities(this);
        this._arousal = new ArousalUtilities(this);
        this._stat = new StatUtilities(this);
        this._setting = new SettingUtilities(this);
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

    public static get settings(): SettingUtilities {
        return this.instance._setting;
    }

    public get data(): WolfGrilData {
        return this._data as WolfGrilData;
    }

    public static init(mod: ModSDKModAPI, msg?: string) {
        let then_: ((mod: ModSDKModAPI) => void) | undefined = undefined;

        const load_then_message = (C: PlayerCharacter | null | undefined) => {
            if (this._instance) return;
            if (C) {
                this._instance = new DataManager(C);
                if (msg) console.log(msg);
                if (then_) then_(mod);
            }
        };

        mod.hookFunction('LoginResponse', 1, (args, next) => {
            next(args);
            load_then_message(args[0] as PlayerCharacter);
        });

        if (Player && Player.MemberNumber) {
            load_then_message(Player);
        }

        return { then: (cb: (mod: ModSDKModAPI) => void) => then_ = cb };
    }

    load(C: PlayerCharacter) {
        const defaultData = C.ExtensionSettings[DataKeyName];
        const frequentData = C.ExtensionSettings[FrequentDataKeyName];
        this._data = deserialize([defaultData, frequentData]);
    }

    save(key?: DataKeys) {
        if (Player && Player.ExtensionSettings) {
            if (key === undefined || isDefaultDataKey(key)) {
                Player.ExtensionSettings[DataKeyName] = serialize(PickDefaultData(this._data));
                ServerPlayerExtensionSettingsSync(DataKeyName);
            }
            if (key === undefined || isFrequentDataKey(key)) {
                Player.ExtensionSettings[FrequentDataKeyName] = serialize(PickFrequenceData(this._data));
                ServerPlayerExtensionSettingsSync(FrequentDataKeyName);
            }
        }
    }
}
