import { CheckOutfitItem } from "bc-utilities";
import { OutfitItems, OutfitItemsMap } from "../OutfitCtrl";

export function IsFullyDressed(player: Character): boolean {
    const items_map = new Map<string, Item>(
        player.Appearance.map(e => [e.Asset.Group.Name, e])
    );
    return OutfitItems.every(e => {
        const item = items_map.get(e.Asset.Group);
        if (!item) return false;
        if (!CheckOutfitItem(item, e)) return false;
        return true;
    });
}

export function IsCollarOn(target: Character): boolean {
    const group = "ItemNeck";
    const item = target.Appearance.find(e => e.Asset.Group.Name === group);
    const outfit = OutfitItemsMap.get(group);
    if (!item || !outfit) return false;
    if (!CheckOutfitItem(item, outfit)) return false;
    return true;
}

function IsGroupsDressed(player: PlayerCharacter, groups: AssetGroupItemName[]) {
    let groups_set: Set<string> = new Set(groups);
    let tItems = player.Appearance.filter(e => groups_set.has(e.Asset.Group.Name));
    if (tItems.length !== groups.length) return false;
    return tItems.every(e => {
        const outfit = OutfitItemsMap.get(e.Asset.Group.Name);
        if (!outfit) return false;
        if (!CheckOutfitItem(e, outfit)) return false;
        return true;
    });
}

export function IsPlayerWolfGirl(player: PlayerCharacter): boolean {
    return IsGroupsDressed(player, ["ItemNeck"]) || IsGroupsDressed(player, ["ItemVulva"]);
}