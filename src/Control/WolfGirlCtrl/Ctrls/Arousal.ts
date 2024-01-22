import { CtrlType, IController } from "../ICtrl";

export class ArousalCtrl extends IController {
    readonly type = "ArousalCtrl";
    readonly target_item = ["ItemPelvis"];
    set(player: Character, item: Item[], type: CtrlType): void {
        const [pelvis] = item;
        const oldLock = pelvis.Property?.LockedBy;
        const oldMember = pelvis.Property?.LockMemberNumber;
        ExtendedItemSetOptionByRecord(player, pelvis, {
            o: (() => {
                if (type === "off") return 0;
                else if (type === "edge") return 1;
                else if (type === "deny") return 2;
                else return 0;
            })()
        });

        // record setting is not correct for some reason
        ExtendedItemInit(player, pelvis);
        if (oldLock && oldMember) InventoryLock(player, pelvis, oldLock, oldMember);
    }
}