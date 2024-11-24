import { AppearanceUpdate, OrgasmMonitor, buildItemsMap } from "bc-utilities"
import { IsPlayerWolfGirl } from "./WolfGirlCtrl";
import { DataManager } from "../Data";
import { OutfitItemsMap } from "./OutfitCtrl";
import { FuturisticBypass } from "./WolfGirlCtrl/Ctrls/FuturisticBypass";
import { ParseMessage } from "./Message";
import { DoShockPunish } from "./PunishWork";
import { DefaultCheckOutfitItem } from "./OutfitCtrl/Utils";

type ModeStashSpecialType = {
    value: string
}

type ModeStashDefaultType = {
    value: TypeRecord
}

type ModeStashType = ModeStashDefaultType | ModeStashSpecialType;

const ItemMode: {
    [key in AssetGroupItemName]?: ModeStashType
} = {
    ItemHead: {
        value: { typed: 3 }
    },
    ItemEars: {
        value: { typed: 3 }
    },
    ItemMouth: {
        value: { g: 2 }
    },
    ItemArms: {
        value: { typed: 3 }
    },
    ItemHands: {
        value: { typed: 0 }
    },
    ItemLegs: {
        value: { typed: 1 }
    },
    ItemFeet: {
        value: { typed: 1 }
    },
    ItemVulva: {
        value: "special"
    },
}

const SavedItemMode: {
    [key in AssetGroupItemName]?: ModeStashType & { time: number }
} = {}

function isSpecialMode(target: ModeStashType): target is ModeStashSpecialType {
    return typeof target.value === "string";
}

function isDefaultMode(target: ModeStashType): target is ModeStashDefaultType {
    return !isSpecialMode(target);
}

function stdCanSetPunishedMode(item: Item, target: ModeStashDefaultType): boolean {
    const tr = item.Property?.TypeRecord;
    if (tr === undefined) return false;
    return Object.keys(target.value).some(key => {
        return tr[key] !== target.value[key];
    });
}

function stdCanRestorePunishedMode(item: Item, saved: ModeStashDefaultType | undefined): saved is ModeStashDefaultType {
    const tr = item.Property?.TypeRecord;
    if (tr === undefined) return false;
    if (saved === undefined) return false;
    return Object.keys(saved.value).some(key => tr[key]);
}

function stdSetPunishedMode(player: PlayerCharacter, item: Item, target: ModeStashDefaultType) {
    const tr = item.Property?.TypeRecord;
    if (tr === undefined) return;

    const saved: TypeRecord = {};
    Object.keys(target.value).forEach(key => saved[key] = tr[key]);
    FuturisticBypass.instance.on = true;
    ExtendedItemSetOptionByRecord(player, item, target.value);
    FuturisticBypass.instance.on = false;
    SavedItemMode[item.Asset.Group.Name as AssetGroupItemName] = { time: Date.now(), value: saved };
}

function stdRestorePunishedMode(player: PlayerCharacter, item: Item, saved: ModeStashDefaultType) {
    const tr = item.Property?.TypeRecord;
    if (tr === undefined) return;
    FuturisticBypass.instance.on = true;
    ExtendedItemSetOptionByRecord(player, item, saved.value, { push: true });
    FuturisticBypass.instance.on = false;
}

function canPunish(item: Item, target: ModeStashType | undefined): boolean {
    if (target === undefined) return false;
    if (isDefaultMode(target)) {
        return stdCanSetPunishedMode(item, target);
    }
    if (isSpecialMode(target)) {
        if (item.Asset.Group.Name === "ItemVulva") {
            const triggerValue = item.Property?.TriggerValues;
            if (triggerValue === undefined) return false;
            const lls = triggerValue.split(",")
            return lls[lls.length - 1] !== "*";
        } else return false;
    }
    return false;
}

function doPunish(player: PlayerCharacter, item: Item, target: ModeStashType) {
    if (isDefaultMode(target)) {
        stdSetPunishedMode(player, item, target);
    }
    if (isSpecialMode(target)) {
        if (item.Asset.Group.Name === "ItemVulva") {
            if (item.Property?.TriggerValues === undefined) return;
            const lls = item.Property.TriggerValues.split(",");
            const saved = lls[lls.length - 1];
            lls[lls.length - 1] = "*";
            item.Property.TriggerValues = lls.join(",");
            AppearanceUpdate(player, item.Asset.Group.Name);
            SavedItemMode[item.Asset.Group.Name as AssetGroupItemName] = { time: Date.now(), value: saved };
        }
    }
}

function canRestore(item: Item, saved: ModeStashType | undefined): boolean {
    if (saved === undefined) return false;
    if (isDefaultMode(saved)) {
        return stdCanRestorePunishedMode(item, saved);
    }
    if (isSpecialMode(saved)) {
        if (item.Asset.Group.Name === "ItemVulva") {
            const triggerValue = item.Property?.TriggerValues;
            if (triggerValue === undefined) return false;
            const lls = triggerValue.split(",")
            if (lls[lls.length - 1] !== saved.value) return true;
            else {
                SavedItemMode[item.Asset.Group.Name as AssetGroupItemName] = undefined;
                return false;
            }
        }
        return false;
    }
    return false;
}

function doRestore(player: PlayerCharacter, item: Item, saved: ModeStashType) {
    if (isDefaultMode(saved)) {
        stdRestorePunishedMode(player, item, saved);
    }
    if (isSpecialMode(saved)) {
        if (item.Asset.Group.Name === "ItemVulva") {
            if (item.Property?.TriggerValues === undefined) return;
            const lls = item.Property.TriggerValues.split(",");
            lls[lls.length - 1] = saved.value;
            item.Property.TriggerValues = lls.join(",");
            AppearanceUpdate(player, item.Asset.Group.Name);
            SavedItemMode[item.Asset.Group.Name as AssetGroupItemName] = undefined;
        }
    }
}

function randomPick<T>(src: T[]): T {
    return src[Math.floor(Math.random() * src.length)];
}

export class OrgasmPunishMode {
    onOrgasm(player: PlayerCharacter) {
        if (!IsPlayerWolfGirl(player)) return;
        const pModeValue = DataManager.settings.query("orgasmPunishMode");
        if (pModeValue === 0) return;

        const canShockList = player.Appearance.filter(item => item.Asset.Group.Category === "Item")
            .filter(item => DefaultCheckOutfitItem(item, OutfitItemsMap.get(item.Asset.Group.Name)))

        DoShockPunish(player, randomPick(canShockList));

        const canPunishList = canShockList.filter(item => canPunish(item, ItemMode[item.Asset.Group.Name as AssetGroupItemName]));
        if (canPunishList.length === 0) {
            const v = 1;
            DataManager.points.points -= v;
            ParseMessage({ mode: "action", msg: "{player_wg} has deducted {v} points, and the current points are {points}" }, { player }, { v, points: DataManager.points.points });
        } else {
            const target = randomPick(canPunishList);
            doPunish(player, target, ItemMode[target.Asset.Group.Name as AssetGroupItemName] as ModeStashType);
            ParseMessage({ mode: "chat-action", msg: "Oh, how does it feel? {player_wg}, do you know what this icon means now? Will you endure for the sake of freedom, or will you indulge yourself and sink into depravity and become a puppet?" }, { player })
        }
    }

    private resistCounter = 0;
    onResist(player: PlayerCharacter) {
        if (!IsPlayerWolfGirl(player)) return;

        const pModeValue = DataManager.settings.query("orgasmPunishMode");
        if (pModeValue === 0) return;
        this.resistCounter++;

        if (pModeValue === 2 && this.resistCounter <= 4) return;
        if (pModeValue === 1 && this.resistCounter <= 2) return;

        this.resistCounter = 0;
        const canRestoreList = player.Appearance.filter(item => item.Asset.Group.Category === "Item")
            .filter(item => DefaultCheckOutfitItem(item, OutfitItemsMap.get(item.Asset.Group.Name)))
            .filter(item => typeof SavedItemMode[item.Asset.Group.Name as AssetGroupItemName] === "object")
            .filter(item => canRestore(item, ItemMode[item.Asset.Group.Name as AssetGroupItemName]))

        if (canRestoreList.length === 0) return;
        const pick = randomPick(canRestoreList);
        doRestore(player, pick, SavedItemMode[pick.Asset.Group.Name as AssetGroupItemName] as ModeStashType);
        ParseMessage({ mode: "chat-action", msg: "Well done, {player_wg}. It looks like your hard work and perseverance paid off. So, good kids will naturally be rewarded. Keep up the hard work, ok?" }, { player });

    }

    constructor(readonly org: OrgasmMonitor, readonly time_reso: number = 200) {
        setInterval(() => {
            if (!Player || !IsPlayerWolfGirl(Player)) {
                Object.keys(SavedItemMode).forEach(key => SavedItemMode[key as AssetGroupItemName] = undefined);
                return;
            }

            const pModeValue = DataManager.settings.query("orgasmPunishMode");
            if (pModeValue === 0 || pModeValue === 2) return;
            const punish_time = DataManager.points.orgasm_punish_time;
            const now = Date.now();
            const itemsMap = buildItemsMap(Player);

            for (const [key, value] of Object.entries(SavedItemMode)) {
                if (value === undefined) continue;

                const item = itemsMap.get(key as AssetGroupItemName);

                if (item === undefined || !DefaultCheckOutfitItem(item, OutfitItemsMap.get(item.Asset.Group.Name))) {
                    SavedItemMode[key as AssetGroupItemName] = undefined;
                    continue;
                }

                if (now - value.time > punish_time) {
                    doRestore(Player, item, value);
                    SavedItemMode[key as AssetGroupItemName] = undefined;
                }
            }
        }, time_reso);

        org.onOrgasm(p => this.onOrgasm(p));
        org.onResist(p => this.onResist(p));
    }

    static _instance: OrgasmPunishMode | undefined = undefined;
    static init(org: OrgasmMonitor) {
        if (this._instance) return;
        this._instance = new OrgasmPunishMode(org);
    }
}