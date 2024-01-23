import { DataManager } from "../../Data";
import { EILNetwork } from "../../Network";
import { AppearanceUpdate } from "../../utils/Apperance";
import { IMessage, ParseMessage } from "../Message";
import { TimedWork, TimedWorkState } from "../Worker";
import { OutfitItemsMap } from "./Definition";
import { OutfitItemType } from "./OutfitTypes";
import { CalculateLocks, CheckItem, CheckItemRaw, ItemFromOutfit } from "./Utils";


interface OutfitCheckWorkItem {
    readonly target: OutfitItemType;
    readonly option?: TypeRecord;
    readonly property?: ItemProperty;
}

interface OutfitCheckStringWorkItem {
    readonly target: string;
    readonly option?: TypeRecord;
    readonly property?: ItemProperty;
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
    readonly ret: "passed" | "canfix" | "blocked";
    readonly counter: number;
}

export class OutfitFixWork extends TimedWork {
    private readonly _target: OutfitCheckWorkItem[];
    private readonly _message?: (passed: OutfitFixWorkResult) => IMessage | undefined | void;
    private readonly _acting_chara: Character | number;

    constructor(acting_chara: Character | number, target: (string | OutfitItemType | OutfitCheckWorkParamItem)[], message?: (result: OutfitFixWorkResult) => IMessage | undefined | void) {
        super();
        this._target = target.map(i => {
            if (typeof i === "string") return { target: OutfitItemsMap.get(i) as OutfitItemType };
            else if (IsWorkItem(i)) return i;
            else if (IsStringWorkItem(i)) return { target: OutfitItemsMap.get(i.target) as OutfitItemType, option: i.option };
            else return { target: i };
        });
        this._message = message;
        this._acting_chara = acting_chara;
    }

    run(player: Character): TimedWorkState {
        const app_map = new Map<string, Item>(player.Appearance.map(i => [i.Asset.Group.Name, i]));
        const craft = EILNetwork.Access.craft;

        let result = this._target.reduce((acc, i) => {
            const existed_i = app_map.get(i.target.Asset.Group);
            if (!existed_i) acc.failed.push(i);
            else if (CheckItemRaw(existed_i, i.target, craft)) { } // do nothing
            else if (existed_i.Property && existed_i.Property.Effect?.includes("Lock")) acc.blocked.push(i);
            else acc.failed.push(i);
            return acc;
        }, { failed: [], blocked: [] } as { failed: OutfitCheckWorkItem[], blocked: OutfitCheckWorkItem[] });

        const do_message = (result: OutfitFixWorkResult) =>
            ((msg: IMessage | undefined | void) => { if (msg) ParseMessage(msg, { player }) })(this._message ? this._message(result) : undefined);

        if (result.blocked.length > 0) {
            do_message({ ret: "blocked", counter: 0 });
            return TimedWorkState.interrupted;
        }

        if (result.failed.length === 0) {
            do_message({ ret: "passed", counter: 0 });
            return TimedWorkState.finished;
        }

        const saved_item = DataManager.outfit.items;

        const lock = CalculateLocks(this._acting_chara, player);

        player.Appearance = player.Appearance.concat(this._target.map(i => {
            const existed_i = app_map.get(i.target.Asset.Group);
            const expected_i = ItemFromOutfit(player, player, i.target, craft) as Item;
            ((saved: DataOutfitItem | undefined, then: () => void) => {
                if (!saved) return then();
                if (saved.color) expected_i.Color = saved.color;
                if (saved.property) expected_i.Property = saved.property;
            })(saved_item.get(i.target.Asset.Group), () => {
                if (i.option) ExtendedItemSetOptionByRecord(player, expected_i, i.option);
                if (!expected_i.Property) expected_i.Property = {};
                if (i.property) {
                    Object.assign(expected_i.Property, i.property);
                } else {
                    InventoryLock(player, expected_i, lock, player.MemberNumber)
                }
            });
            if (!existed_i) return expected_i;
            else Object.assign(existed_i, expected_i);
        }).filter(i => i !== undefined) as Item[]);
        AppearanceUpdate(player);
        do_message({ ret: "canfix", counter: result.failed.length });
        return TimedWorkState.finished;
    }
}