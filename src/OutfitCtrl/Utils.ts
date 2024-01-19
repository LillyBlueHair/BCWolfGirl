import { OutfitItemType } from "./OutfitTypes";

export function ItemFromOutfit(player: Character, wearer: Character, v: OutfitItemType) {
    const asset = AssetGet(wearer.AssetFamily, v.Asset.Group, v.Asset.Name);
    if (!asset) {
        console.error("Asset not found: " + v.Asset.Group + "/" + v.Asset.Name);
        return undefined;
    }

    const craft: CraftingItem = {
        Item: v.Asset.Name,
        Property: v.Craft.Property || "Normal",
        Color: Array.isArray(v.Color) ? v.Color.join(",") : v.Color,
        Lock: v.Craft.Lock || "",
        Name: v.Craft.Name,
        Description: v.Craft.Description,
        MemberName: CharacterNickname(player),
        MemberNumber: player.MemberNumber,
        Private: true,
        ItemProperty: v.Craft.ItemProperty || undefined,
    }

    const tItem = {
        Asset: asset,
        Color: v.Color,
        Craft: craft,
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