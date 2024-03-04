import { CheckOutfitItem } from "bc-utilities";
import { OutfitItems, OutfitItemsMap } from "../OutfitCtrl";

export function IsFullyDressed(player: Character): boolean {
    const items_map = new Map<string, Item>(
        player.Appearance.map(e => [e.Asset.Group.Name, e])
    );
    return OutfitItems.every(e => {
        const item = items_map.get(e.Asset.Group);
        if (!item || !CheckOutfitItem(item, e, { craft: true, lock: true })) return false;
        return true;
    });
}

export function IsCollarOn(target: Character): boolean {
    const group = "ItemNeck";
    const item = target.Appearance.find(e => e.Asset.Group.Name === group);
    const outfit = OutfitItemsMap.get(group);
    if (!item || !outfit) return false;
    if (!CheckOutfitItem(item, outfit, { craft: true, lock: true })) return false;
    return true;
}

function IsGroupsDressed(player: PlayerCharacter, groups: AssetGroupItemName[]) {
    let tItems = player.Appearance.filter(e => groups.includes(e.Asset.Group.Name as AssetGroupItemName));
    if (tItems.length !== groups.length) return false;
    return tItems.every(e => {
        const outfit = OutfitItemsMap.get(e.Asset.Group.Name);
        if (!CheckOutfitItem(e, outfit, { craft: true, lock: true })) return false;
        return true;
    });
}

export function IsPlayerWolfGirl(player: PlayerCharacter): boolean {
    return IsGroupsDressed(player, ["ItemNeck"]) || IsGroupsDressed(player, ["ItemVulva"]);
}