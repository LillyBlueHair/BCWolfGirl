import { CtrlType, IController } from "../ICtrl";

export class ArousalCtrl extends IController {
    target_item = ["ItemPelvis"];
    set(player: Character, item: Item[], type: CtrlType): void {
        const [pelvis] = item;
        const oldtype = pelvis.Property?.TypeRecord;
        if (!oldtype) return;

        if (type === "off") {
            oldtype["o"] = 0;
        }
        else if (type === "edge") {
            oldtype["o"] = 1;
        }
        else if (type === "deny") {
            oldtype["o"] = 2;
        }
        const oldLock = pelvis.Property?.LockedBy;
        const oldMember = pelvis.Property?.LockMemberNumber;
        ExtendedItemSetOptionByRecord(player, pelvis, oldtype);

        // record setting is not correct for some reason
        ExtendedItemInit(player, pelvis);
        if (oldLock && oldMember) InventoryLock(player, pelvis, oldLock, oldMember);
    }
}