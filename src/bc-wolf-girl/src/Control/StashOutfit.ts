import { AppearanceUpdate } from "bc-utilities";
import { DataManager } from "../Data";
import { EILNetwork } from "../Network";
import { GatherAppMap } from "../utils/Apperance";
import { OutfitItemsMap } from "./OutfitCtrl";
import { DefaultCheckOutfitItem, ItemFromOutfit } from "./OutfitCtrl/Utils";


export function GatherDataOutfitItem(player: PlayerCharacter): DataOutfitItem[] {
    let result: DataOutfitItem[] = [];

    player.Appearance.forEach(item => {
        const ti = OutfitItemsMap.get(item.Asset.Group.Name);
        if (ti && DefaultCheckOutfitItem(item, ti)) {
            result.push({
                asset: {
                    group: item.Asset.Group.Name,
                    name: item.Asset.Name,
                },
                color: item.Color ?? "Default",
                property: item.Property,
            });
        }
    });

    return result;
}

export function GatherColorStoreItem(player: PlayerCharacter): ColorStoreItem[] {
    let result: ColorStoreItem[] = [];
    player.Appearance.forEach(item => {
        const ti = OutfitItemsMap.get(item.Asset.Group.Name);
        if (ti && DefaultCheckOutfitItem(item, ti)) {
            result.push({
                asset: item.Asset.Name,
                group: item.Asset.Group.Name,
                color: item.Color ?? "Default",
            });
        }
    });
    return result;
}

export function StashOutfit(player: PlayerCharacter) {
    const exclude = ['ItemNeck', 'ItemPelvis'];
    let saved: DataOutfitItem[] = [];
    player.Appearance = player.Appearance.map(item => {
        if (exclude.includes(item.Asset.Group.Name)) return item;
        const ti = OutfitItemsMap.get(item.Asset.Group.Name);
        if (ti && DefaultCheckOutfitItem(item, ti)) {
            saved.push({
                asset: {
                    group: item.Asset.Group.Name,
                    name: item.Asset.Name,
                },
                color: item.Color ?? "Default",
                property: item.Property,
            });
            return undefined;
        }
        return item;
    }).filter(i => i !== undefined) as Item[];

    DataManager.outfit.items = saved;
    AppearanceUpdate(player);
}

export enum StashPopResult {
    Success,
    Locked
}

export function StashPopOutfit(player: PlayerCharacter): StashPopResult {
    const saved = [...DataManager.outfit.items.values()];

    const app_map = GatherAppMap(player);

    const craft = EILNetwork.Access.craft;

    if (saved.some(i => {
        const item = app_map.get(i.asset.group);
        if (!item) return false;
        if (DefaultCheckOutfitItem(item, OutfitItemsMap.get(i.asset.group))) return false;
        if (item.Property?.Effect?.includes("Lock") ?? true) return true;
        return false;
    })) return StashPopResult.Locked;

    saved.forEach(i => {
        const item = app_map.get(i.asset.group);
        const oi = OutfitItemsMap.get(i.asset.group);
        if (!oi) return;
        if (oi.Asset.Name !== i.asset.name) return;
        const nitem = ItemFromOutfit(player, player, oi);
        if (!nitem) return;

        Object.assign(nitem, { Color: i.color, Property: i.property });

        if (!item) {
            player.Appearance.push(nitem);
        } else {
            Object.assign(item, nitem);
        }
    });

    DataManager.outfit.items = [];
    AppearanceUpdate(player);
    return StashPopResult.Success;
}