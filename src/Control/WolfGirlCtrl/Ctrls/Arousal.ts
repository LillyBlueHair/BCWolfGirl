import { CtrlType, IController, TestCtrlResult, TAccept, TReject } from "..";
import { DetailedItemTestRecords } from "../Ctrls";

function calcRecordValue(type: CtrlType) {
    if (type === "off") return { o: 0 };
    else if (type === "edge") return { o: 1 };
    else if (type === "deny") return { o: 2 };
    else return { o: 0 };
}

export class ArousalCtrl extends IController {
    readonly type = "ArousalCtrl";
    readonly target_item = ["ItemPelvis"];
    readonly available_ctrls: CtrlType[] = ["off", "edge", "deny"];
    set(player: Character, item: Item[], type: CtrlType): void {
        const [pelvis] = item;
        const oldLock = pelvis.Property?.LockedBy;
        const oldMember = pelvis.Property?.LockMemberNumber;
        ExtendedItemSetOptionByRecord(player, pelvis, calcRecordValue(type));

        // record setting is not correct for some reason
        ExtendedItemInit(player, pelvis);
        if (oldLock && oldMember) InventoryLock(player, pelvis, oldLock, oldMember);
    }

    test(player: Character, item: Item[], type: CtrlType): TestCtrlResult {
        return DetailedItemTestRecords(item, (oldrecords) => {
            const [pelvis] = oldrecords;
            if (pelvis.o !== undefined) {
                if (pelvis.o === calcRecordValue(type).o) return TReject("unchanged");
                return TAccept();
            }
            return TReject("itemprop");
        });
    }
}