import { DataManager } from "../Data";
import { AppearanceUpdate } from "../utils/Apperance";
import { OutfitItemsMap } from "./OutfitCtrl";
import { CheckItemRaw } from "./OutfitCtrl/Utils";


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

    DataManager.outfit.add(saved);
    AppearanceUpdate(player);
}

export enum StashPopResult {
    Success,
    Locked
}

export function StashPopOutfit(player: Character): StashPopResult {
    const saved = DataManager.outfit.items;

    if (!player.Appearance.every(item => {
        const ti = saved.get(item.Asset.Group.Name);
        const eti = OutfitItemsMap.get(item.Asset.Group.Name);
        if (!ti || !eti) return true;
        if (CheckItemRaw(item, eti)) return true;
        if (item.Property?.Effect?.includes("Lock") ?? true) return false;
        return true;
    })) return StashPopResult.Locked;

    player.Appearance = player.Appearance.map(item => {
        const ti = saved.get(item.Asset.Group.Name);
        if (!ti) return item;
        const asset = AssetGet(player.AssetFamily, item.Asset.Group.Name, item.Asset.Name)
        saved.delete(item.Asset.Group.Name);
        return {
            ...item,
            Asset: asset,
            Color: ti.color,
            Difficulty: 46,
            Property: ti.property,
        }
    }).concat(Array.from(saved.values()).map(i => {
        return {
            Asset: AssetGet(player.AssetFamily, i.asset.group, i.asset.name),
            Color: i.color,
            Difficulty: 46,
            Property: i.property,
        }
    })) as Item[];

    AppearanceUpdate(player);
    return StashPopResult.Success;
}