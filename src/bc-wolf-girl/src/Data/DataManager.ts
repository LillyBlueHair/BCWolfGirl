import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DataKeyName, FrequentDataKeyName } from "../Definition";
import { PermissionUtilities } from "./PermissionUtilities";
import { OutfitUtilities } from "./OutfitUtilities";
import { Validate } from "./DefaultValue";
import { PointsUtilities } from "./PointUtilities";
import { ArousalUtilities } from "./ArousalUtilities";
import { StatUtilities } from "./StatUtilities";
import { FrequentData, DefaultData, isDefaultDataKey, PickDefaultData, isFrequentDataKey, PickFrequenceData, DataKeys } from "./DataCategory";


function deserialize(str: (string | undefined)[]): WolfGirlData {
    const data = str.reduce((prev, cur) => {
        if (!cur) return prev;
        let d = LZString.decompressFromBase64(cur);
        try {
            let decoded = JSON.parse(d);
            return Object.assign(prev, decoded);
        } catch {
            return prev;
        }
    }, {} as Partial<WolfGirlData>);
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

const WrongDataKeyName = "BCWolfGrilData";
const WrongFrequentDataKeyName = "BCWolfGrilFrequentData";

function load(C: PlayerCharacter) {
    const wrongDefaultData = C.ExtensionSettings[WrongDataKeyName];
    const wrongFrequentData = C.ExtensionSettings[WrongFrequentDataKeyName];
    if (wrongDefaultData || wrongFrequentData) {
        const ret = deserialize([wrongDefaultData, wrongFrequentData]);
        C.ExtensionSettings[WrongDataKeyName] = null;
        C.ExtensionSettings[WrongFrequentDataKeyName] = null;

        C.ExtensionSettings[DataKeyName] = wrongDefaultData;
        C.ExtensionSettings[FrequentDataKeyName] = wrongFrequentData;

        ServerPlayerExtensionSettingsSync(WrongDataKeyName);
        ServerPlayerExtensionSettingsSync(WrongFrequentDataKeyName);
        ServerPlayerExtensionSettingsSync(DataKeyName);
        ServerPlayerExtensionSettingsSync(FrequentDataKeyName);
        return ret;
    }

    const defaultData = C.ExtensionSettings[DataKeyName];
    const frequentData = C.ExtensionSettings[FrequentDataKeyName];
    return deserialize([defaultData, frequentData]);
}

function save(data: WolfGirlData, key?: DataKeys) {
    if (Player && Player.ExtensionSettings) {
        if (key === undefined || isDefaultDataKey(key)) {
            Player.ExtensionSettings[DataKeyName] = serialize(PickDefaultData(data));
            ServerPlayerExtensionSettingsSync(DataKeyName);
        }
        if (key === undefined || isFrequentDataKey(key)) {
            Player.ExtensionSettings[FrequentDataKeyName] = serialize(PickFrequenceData(data));
            ServerPlayerExtensionSettingsSync(FrequentDataKeyName);
        }
    }
}

export class DataManager {
    private static _instance: DataManager | undefined = undefined;
    private _permission: PermissionUtilities;
    private _outfit: OutfitUtilities;
    private _points: PointsUtilities;
    private _arousal: ArousalUtilities;
    private _stat: StatUtilities;
    private _setting: SettingUtilities;

    constructor(readonly data: WolfGirlData) {
        this._permission = new PermissionUtilities(this);
        this._outfit = new OutfitUtilities(this);
        this._points = new PointsUtilities(this);
        this._arousal = new ArousalUtilities(this);
        this._stat = new StatUtilities(this);
        this._setting = new SettingUtilities(this);
    }

    save(key?: DataKeys) {
        save(this.data, key);
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

    public static init(mod: ModSDKModAPI, msg?: string) {
        let then_: ((data: DataManager) => void) | undefined = undefined;

        const load_then_message = (C: PlayerCharacter | null | undefined) => {
            if (this._instance) return;
            if (C) {
                const data = load(C);
                this._instance = new DataManager(data);
                if (msg) console.log(msg);
                if (then_) then_(this._instance);
            }
        };

        mod.hookFunction('LoginResponse', 1, (args, next) => {
            next(args);
            load_then_message(args[0] as PlayerCharacter);
        });

        if (Player && Player.MemberNumber) {
            load_then_message(Player);
        }

        return { accepted: (cb: (data: DataManager) => void) => then_ = cb };
    }
}
