import { OutfitItems } from "../OutfitCtrl";
import { OutfitItemType } from "../OutfitCtrl";

function ItemValid(item: Item, src: OutfitItemType) {
    if (item.Asset.Name !== src.Asset.Name) return false;
    if (src.Craft) {
        if (!item.Craft) return false;
        if (item.Craft.Name !== src.Craft.Name) return false;
        if (item.Craft.Description !== src.Craft.Description) return false;
    }
    if (!item.Property) return false;
    if (!item.Property.Effect) return false;
    if (item.Asset.AllowLock && !item.Property.Effect.includes("Lock")) return false;
    return true;
}

export function IsPlayerWolfGirl(player: Character): boolean {
    const items_map = new Map<string, Item>(
        player.Appearance.map(e => [e.Asset.Group.Name, e])
    );
    return OutfitItems.every(e => {
        const item = items_map.get(e.Asset.Group);
        if (!item) return false;
        if (!ItemValid(item, e)) return false;
        return true;
    });
}