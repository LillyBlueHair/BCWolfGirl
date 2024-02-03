import { DataManager } from "../Data";
import { EILNetwork } from "../Network";
import { AppearanceUpdate } from "../utils/Apperance";
import { OutfitItemType, OutfitItemsMap } from "./OutfitCtrl";
import { CheckItemRaw, CraftingItemFromOutfit } from "./OutfitCtrl/Utils";


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

    const craft = EILNetwork.Access.craft;

    player.Appearance = player.Appearance.map(item => {
        const ti = saved.get(item.Asset.Group.Name);
        if (!ti) return item;
        const asset = AssetGet(player.AssetFamily, item.Asset.Group.Name, item.Asset.Name)
        const oi = OutfitItemsMap.get(item.Asset.Group.Name) as OutfitItemType;
        saved.delete(item.Asset.Group.Name);
        return {
            ...item,
            Asset: asset,
            Color: ti.color,
            Difficulty: 46,
            Property: ti.property,
            Craft: CraftingItemFromOutfit(player, oi, craft),
        }
    }).concat(Array.from(saved.values()).map(i => {
        const oi = OutfitItemsMap.get(i.asset.group) as OutfitItemType;

        return {
            Asset: AssetGet(player.AssetFamily, i.asset.group, i.asset.name),
            Color: i.color,
            Difficulty: 46,
            Property: i.property,
            Craft: CraftingItemFromOutfit(player, oi, craft),
        }
    })) as Item[];

    AppearanceUpdate(player);
    return StashPopResult.Success;
}