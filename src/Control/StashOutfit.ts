import { DataManager } from "../Data";
import { EILNetwork } from "../Network";
import { AppearanceUpdate } from "../utils/Apperance";
import { OutfitItemType, OutfitItemsMap } from "./OutfitCtrl";
import { CheckItemRaw, CraftingItemFromOutfit, ItemFromOutfit } from "./OutfitCtrl/Utils";


export function GatherDataOutfitItem(player: Character): DataOutfitItem[] {
    let result: DataOutfitItem[] = [];

    player.Appearance.forEach(item => {
        const ti = OutfitItemsMap.get(item.Asset.Group.Name);
        if (ti && CheckItemRaw(item, ti)) {
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

export function GatherColorStoreItem(player: Character): ColorStoreItem[] {
    let result: ColorStoreItem[] = [];
    player.Appearance.forEach(item => {
        const ti = OutfitItemsMap.get(item.Asset.Group.Name);
        if (ti && CheckItemRaw(item, ti)) {
            result.push({
                asset: item.Asset.Group.Name,
                group: item.Asset.Name,
                color: item.Color ?? "Default",
            });
        }
    });
    return result;
}

export function StashOutfit(player: Character) {
    const exclude = ['ItemNeck', 'ItemPelvis'];
    let saved: DataOutfitItem[] = [];
    player.Appearance = player.Appearance.map(item => {
        if (exclude.includes(item.Asset.Group.Name)) return item;
        const ti = OutfitItemsMap.get(item.Asset.Group.Name);
        if (ti && CheckItemRaw(item, ti)) {
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

export function StashPopOutfit(player: Character): StashPopResult {
    const saved = [...DataManager.outfit.items.values()];

    const app_map = new Map(player.Appearance.map(i => [i.Asset.Group.Name, i] as [string, Item]));

    const craft = EILNetwork.Access.craft;

    if (saved.some(i => {
        const item = app_map.get(i.asset.group);
        if (!item) return false;
        if (CheckItemRaw(item, OutfitItemsMap.get(i.asset.group) as OutfitItemType, craft)) return false;
        if (item.Property?.Effect?.includes("Lock") ?? true) return true;
        return false;
    })) return StashPopResult.Locked;

    saved.forEach(i => {
        const item = app_map.get(i.asset.group);
        const oi = OutfitItemsMap.get(i.asset.group) as OutfitItemType;
        if (oi.Asset.Name !== i.asset.name) return;
        const nitem = ItemFromOutfit(player, player, oi, craft);
        if (!nitem) return;
        if (!item) {
            Object.assign(nitem, { Color: i.color, Property: i.property });
            player.Appearance.push(nitem);
        } else {
            Object.assign(item, nitem);
        }
    });

    DataManager.outfit.items = [];
    AppearanceUpdate(player);
    return StashPopResult.Success;
}