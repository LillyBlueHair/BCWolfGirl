import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DataKeyName } from "./Definition";
import { EILNetwork } from "./Network";
import { ExtractMemberNumber } from "./utils/Character";

function defaultValue(): WolfGrilData {
    return {
        color: {
            patterns: []
        },
        permission: {
            moderators: [],
            loverModerators: true
        },
        points: {
            current: 0
        },
        arousal: {
            orgasm: 0,
            deny: 0,
            resist: 0,
            edge_time: 0,
        }
    }
}

class PermissionUtilities {
    parent: DataManager;
    constructor(parent: DataManager) {
        this.parent = parent;
    }

    setLoverMode(arg: boolean) {
        this.parent.data.permission.loverModerators = arg;
        this.parent.save();
    }

    setModerator(id: number, add: boolean) {
        if (add) {
            if (!this.parent.data.permission.moderators.includes(id)) {
                this.parent.data.permission.moderators.push(id);
            }
        } else {
            const index = this.parent.data.permission.moderators.indexOf(id);
            if (index !== -1) {
                this.parent.data.permission.moderators.splice(index, 1);
            }
        }
        this.parent.save();
    }

    get data() {
        return this.parent.data.permission;
    }

    isModerator(player: Character, other: number | Character): boolean {
        const num = ExtractMemberNumber(other);
        if (EILNetwork.Access.isEIL(num)) return true;
        if (player.Ownership && player.Ownership.MemberNumber === num) return true;
        if (this.parent.data.permission.moderators.includes(num)) return true;
        if (this.parent.data.permission.loverModerators
            && player.Lovership && player.Lovership.some(i => i.MemberNumber === num)) return true;
        return false;
    }

    canModerate(player: Character, other: Character): boolean {
        if (!player.MemberNumber) return false;
        if (EILNetwork.Access.isEIL(player.MemberNumber)) return true;
        if (other.Ownership && other.Ownership.MemberNumber === player.MemberNumber) return true;
        if (other.Lovership && other.Lovership.some(i => i.MemberNumber === player.MemberNumber)) return true;
        return false;
    }
}


export class DataManager {
    private static _instance: DataManager | undefined = undefined;
    private _data: Partial<WolfGrilData> = {};

    public static get instance(): DataManager {
        return this._instance as DataManager;
    }

    public static get permission(): PermissionUtilities {
        return new PermissionUtilities(this.instance);
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

        Object.assign(this._data, data);
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