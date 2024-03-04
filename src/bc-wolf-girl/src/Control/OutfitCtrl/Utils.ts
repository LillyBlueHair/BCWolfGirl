import { EILNetwork } from "../../Network";
import { ExtractMemberNumber } from "../../utils/Character";
import { OutfitItems, OutfitItemsMap } from "./Definition";
import { CheckOutfitItem, OutfitItemManifest, OutfitItemType, buildAppMap } from "bc-utilities";

export function ItemFromOutfit(acting: number | Character, acted: Character, v: OutfitItemType) {
    const num = ExtractMemberNumber(acting);
    const lock = CalculateLocks(num, acted);
    const ecraft = EILNetwork.Access.craft;
    return OutfitItemManifest(acted, v, {
        craft: { MemberName: ecraft.name, MemberNumber: ecraft.uid }, lock: {
            Lock: lock,
            MemberNumber: num,
        }
    });
}

/**
 * Check if the bc item matches the outfit item
 * @param item The bc item, if undefined, return false
 * @param v The outfit item, if undefined, return false
 * @param lock whether to check the lock status
 * @returns return true if the item matches the outfit item
 */
export function DefaultCheckOutfitItem(item: Item | undefined, v: OutfitItemType | undefined, lock?: boolean) {
    const ecraft = EILNetwork.Access.craft;
    return CheckOutfitItem(item, v, { craft: { MemberName: ecraft.name, MemberNumber: ecraft.uid }, lock: lock ?? true });
}

export function DefaultCheckItemOnTarget(target: Character, item: OutfitItemType | undefined, lock?: boolean) {
    if (!item) return false;
    const i = target.Appearance.find(e => e.Asset.Group.Name === item.Asset.Group);
    if (!i) return false;
    return DefaultCheckOutfitItem(i, item, lock);
}

export function DefaultCheckItemByGroup(target: Character, group: AssetGroupItemName, lock?: boolean) {
    const oi = OutfitItemsMap.get(group);
    if (!oi) return false;
    return DefaultCheckItemOnTarget(target, oi, lock);
}

export function DefaultCheckItems(target: Character, item: (OutfitItemType | AssetGroupName)[], lock?: boolean) {
    const items_map = buildAppMap(target);
    const ecraft = EILNetwork.Access.craft;
    const option = { craft: { MemberName: ecraft.name, MemberNumber: ecraft.uid }, lock };

    return item.every(e => {
        const group = typeof e === "string" ? e : e.Asset.Group;
        const item = items_map.get(group);
        const oitem = typeof e === "string" ? OutfitItemsMap.get(group) : e;
        if (!item || !oitem) return false;

        return CheckOutfitItem(item, oitem, option);
    });
}

export function CheckMissingItems(player: PlayerCharacter, lock?: boolean) {
    const app_map = buildAppMap(player);
    const ecraft = EILNetwork.Access.craft;
    const option = { craft: { MemberName: ecraft.name, MemberNumber: ecraft.uid }, lock };

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