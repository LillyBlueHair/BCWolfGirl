import { EILNetwork } from "../../Network";
import { ExtractMemberNumber } from "../../utils/Character";
import { OutfitItems, OutfitItemsMap } from "./Definition";
import { CheckOutfitItem, OutfitItemManifest, OutfitItemType, buildAppMap } from "bc-utilities";

export function ItemFromOutfit(player: Character, wearer: Character, v: OutfitItemType) {
    const lock = CalculateLocks(player, wearer);
    const ecraft = EILNetwork.Access.craft;
    return OutfitItemManifest(wearer, v, {
        craft: { MemberName: ecraft.name, MemberNumber: ecraft.uid }, lock: {
            Lock: lock,
            MemberNumber: player.MemberNumber,
        }
    });
}

export function DefaultCheckOutfitItem(item: Item, v: OutfitItemType | undefined) {
    const ecraft = EILNetwork.Access.craft;
    return CheckOutfitItem(item, v, { craft: { MemberName: ecraft.name, MemberNumber: ecraft.uid } });
}

export function DefaultCheckItemOnTarget(target: Character, item: OutfitItemType) {
    const i = target.Appearance.find(e => e.Asset.Group.Name === item.Asset.Group);
    if (!i) return false;
    return DefaultCheckOutfitItem(i, item);
}

export function DefaultCheckItemByGroup(target: Character, group: AssetGroupItemName) {
    const oi = OutfitItemsMap.get(group);
    if (!oi) return false;
    return DefaultCheckItemOnTarget(target, oi);
}

export function DefaultCheckItems(target: Character, item: (OutfitItemType | AssetGroupName)[]) {
    const items_map = buildAppMap(target);
    const ecraft = EILNetwork.Access.craft;
    const option = { craft: { MemberName: ecraft.name, MemberNumber: ecraft.uid } };

    return item.every(e => {
        const group = typeof e === "string" ? e : e.Asset.Group;
        const item = items_map.get(group);
        const oitem = typeof e === "string" ? OutfitItemsMap.get(group) : e;
        if (!item || !oitem) return false;

        return CheckOutfitItem(item, oitem, option);
    });
}

export function CheckMissingItems(player: PlayerCharacter) {
    const app_map = buildAppMap(player);
    const ecraft = EILNetwork.Access.craft;
    const option = { craft: { MemberName: ecraft.name, MemberNumber: ecraft.uid } };

    const missing = new Set<string>();
    OutfitItems.forEach(e => {
        const i = app_map.get(e.Asset.Group);
        if (!i || !CheckOutfitItem(i, e, option)) missing.add(e.Asset.Group);
    });
    return missing;
}

export function CalculateLocks(locking: Character | number, locked: Character): AssetLockType {
    const num = ExtractMemberNumber(locking);
    if (locked.Ownership && locked.Ownership.MemberNumber === num) return "OwnerPadlock";
    if (locked.Lovership && locked.Lovership.some(e => e.MemberNumber === num))
        return "LoversPadlock";
    return "ExclusivePadlock";
}