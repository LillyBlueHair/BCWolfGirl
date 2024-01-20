import { OutfitItemType } from "./OutfitTypes";

export function CraftingItemFromOutfit(player: Character, v: OutfitItemType, crafter?: { uid: number, name: string }) {
    const craft: CraftingItem = {
        Item: v.Asset.Name,
        Property: v.Craft.Property || "Normal",
        Color: Array.isArray(v.Color) ? v.Color.join(",") : v.Color,
        Lock: v.Craft.Lock || "",
        Name: v.Craft.Name,
        Description: v.Craft.Description,
        MemberName: crafter ? crafter.name : CharacterNickname(player),
        MemberNumber: crafter ? crafter.uid : player.MemberNumber,
        Private: true,
        ItemProperty: v.Craft.ItemProperty || undefined,
    }
    return craft;
}

export function ItemFromOutfit(player: Character, wearer: Character, v: OutfitItemType, crafter?: { uid: number, name: string }) {
    const asset = AssetGet(wearer.AssetFamily, v.Asset.Group, v.Asset.Name);
    if (!asset) {
        console.error("Asset not found: " + v.Asset.Group + "/" + v.Asset.Name);
        return undefined;
    }

    const tItem = {
        Asset: asset,
        Color: v.Color,
        Craft: CraftingItemFromOutfit(player, v, crafter),
        Difficulty: 46,
    } as Item;

    if (!tItem.Property) tItem.Property = {};
    if (v.Craft.TypeRecord) tItem.Property.TypeRecord = v.Craft.TypeRecord;

    if (tItem.Asset.Extended) {
        ExtendedItemInit(wearer, tItem, false, false);
    }

    if (v.Craft.Property) Object.assign(tItem.Property, v.Craft.ItemProperty);
    if (v.Craft.OverridePriority)
        tItem.Property.OverridePriority = v.Craft.OverridePriority;

    return tItem;
}

export function LockItem(player: Character, wearer: Character, item: Item, lock: string) {
    InventoryLock(wearer, item, lock, player.MemberNumber, false);
}

export function CheckItem(target: Character, item: OutfitItemType, crafter?: { uid: number, name: string }) {
    const i = target.Appearance.find(e => e.Asset.Group.Name === item.Asset.Group);
    if (!i) return false;
    if (i.Asset.Name !== item.Asset.Name) return false;
    if (item.Craft) {
        if (!i.Craft) return false;
        if (i.Craft.Name !== item.Craft.Name) return false;
        if (i.Craft.Description !== item.Craft.Description) return false;
        if (crafter && i.Craft.MemberNumber !== crafter.uid) return false;
    }
    return true;
}