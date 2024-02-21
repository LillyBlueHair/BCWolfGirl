import { AppearanceUpdate, OutfitItemType } from "bc-utilities";
import { DataManager } from "../../Data";
import { EILNetwork } from "../../Network";
import { GatherAppMap } from "../../utils/Apperance";
import { IMessage, ParseMessage } from "../Message";
import { TimedWork, TimedWorkState } from "../Worker";
import { OutfitItemsMap } from "./Definition";
import { CalculateLocks, DefaultCheckItemOnTarget, DefaultCheckOutfitItem, ItemFromOutfit } from "./Utils";


interface OutfitCheckWorkItem {
    readonly target: OutfitItemType;
    readonly option?: TypeRecord;
    readonly property?: ItemProperties;
}

interface OutfitCheckStringWorkItem {
    readonly target: AssetGroupItemName;
    readonly option?: TypeRecord;
    readonly property?: ItemProperties;
}

type OutfitCheckWorkParamItem = OutfitCheckWorkItem | OutfitCheckStringWorkItem;

function IsWorkParamItem(item: OutfitCheckWorkParamItem | OutfitItemType): item is OutfitCheckWorkParamItem {
    return (item as OutfitCheckWorkParamItem).target !== undefined;
}

function IsWorkItem(item: OutfitCheckWorkParamItem | OutfitItemType): item is OutfitCheckWorkItem {
    return IsWorkParamItem(item) && typeof (item as OutfitCheckWorkParamItem).target !== "string";
}

function IsStringWorkItem(item: OutfitCheckWorkParamItem | OutfitItemType): item is OutfitCheckStringWorkItem {
    return IsWorkParamItem(item) && typeof (item as OutfitCheckWorkParamItem).target === "string";
}

export interface OutfitFixWorkResult {
    ret: "passed" | "canfix" | "blocked";
    blocked?: string[];
    counter?: number;
}

export class OutfitFixWork extends TimedWork {
    private readonly _target: OutfitCheckWorkItem[];
    private readonly _message?: (passed: OutfitFixWorkResult) => IMessage | undefined | void;
    private readonly _acting_chara: Character | number;

    constructor(acting_chara: Character | number, target: (AssetGroupItemName | OutfitItemType | OutfitCheckWorkParamItem)[], message?: (result: OutfitFixWorkResult) => IMessage | undefined | void) {
        super();
        this._target = target.map(i => {
            if (typeof i === "string") return { target: OutfitItemsMap.get(i) as OutfitItemType };
            else if (IsWorkItem(i)) return i;
            else if (IsStringWorkItem(i)) return { ...i, target: OutfitItemsMap.get(i.target) as OutfitItemType };
            else return { target: i };
        });
        this._message = message;
        this._acting_chara = acting_chara;
    }

    run(player: PlayerCharacter): TimedWorkState {
        const app_map = GatherAppMap(player);
        const craft = EILNetwork.Access.craft;

        let result = this._target.reduce((acc, i) => {
            const existed_i = app_map.get(i.target.Asset.Group);
            if (!existed_i) acc.canRepair.push(i);
            else if (DefaultCheckOutfitItem(existed_i, i.target)) { } // do nothing
            else if (existed_i.Property && existed_i.Property.Effect?.includes("Lock")) acc.blocked.push(i);
            else acc.canRepair.push(i);
            return acc;
        }, { canRepair: [], blocked: [] } as { canRepair: OutfitCheckWorkItem[], blocked: OutfitCheckWorkItem[] });

        const locked_items = result.blocked.map(i => i.target.Asset.Group).map(i => (app_map.get(i) as Item).Asset.Description).join("、");

        const do_message = (result: OutfitFixWorkResult) =>
            (((msg) => msg && ParseMessage(msg, { player }, { locked_items }))(this._message?.(result)));

        if (result.blocked.length > 0) {
            do_message({ ret: "blocked", blocked: result.blocked.map(i => i.target.Asset.Group) });
            return TimedWorkState.interrupted;
        }

        if (result.canRepair.length === 0) {
            do_message({ ret: "passed" });
            return TimedWorkState.finished;
        }

        const saved_item = DataManager.outfit.color_store;

        const lock = CalculateLocks(this._acting_chara, player);

        player.Appearance = player.Appearance.concat(this._target.map(i => {
            const existed_i = app_map.get(i.target.Asset.Group);
            const expected_i = ItemFromOutfit(player, player, i.target);
            if (!expected_i) return undefined;

            const saved = saved_item.get(i.target.Asset.Group);

            if (saved && saved.asset === expected_i.Asset.Name) expected_i.Color = saved.color;
            if (i.option) ExtendedItemSetOptionByRecord(player, expected_i, i.option);
            if (expected_i?.Property?.LockedBy === undefined) InventoryLock(player, expected_i, lock, player.MemberNumber);
            if (!expected_i.Property) expected_i.Property = {};
            if (i.property) Object.assign(expected_i.Property, i.property);

            if (!existed_i) return expected_i;
            else Object.assign(existed_i, expected_i);
        }).filter(i => i !== undefined) as Item[]);
        AppearanceUpdate(player);
        do_message({ ret: "canfix", counter: result.canRepair.length });
        return TimedWorkState.finished;
    }
}