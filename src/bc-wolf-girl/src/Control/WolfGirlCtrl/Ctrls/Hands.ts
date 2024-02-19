import { CtrlType } from "../IController";
import { TAccept } from "../IController";
import { TReject } from "../IController";
import { TestCtrlResult } from "../IController";
import { IController } from "../IController";
import { StandardItemSetRecords } from "../IController";
import { RecordsEqual } from "../IController";
import { StandardItemTestRecords } from "../IController";
import { DetailedItemTestRecords } from "../IController";

function calcRecordValue(type: CtrlType): TypeRecord[] {
    if (type === "off") return [{ typed: 1 }, { typed: 0 }];
    else if (type === "base") return [{ typed: 0 }, { typed: 1 }];
    else if (type === "total") return [{ typed: 0 }, { typed: 3 }];
    else return [{ typed: 1 }, { typed: 0 }];
}

export class HandsCtrl extends IController {
    readonly type = "HandsCtrl";
    readonly target_item = ["ItemHands", "ItemArms"];
    available_ctrls: CtrlType[] = ["off", "base", "total"];
    set(player: PlayerCharacter, item: (Item | undefined)[], type: CtrlType): void {
        StandardItemSetRecords(player, item, calcRecordValue(type));
    }

    test(player: PlayerCharacter, item: Item[], type: CtrlType): TestCtrlResult {
        return StandardItemTestRecords(item, calcRecordValue(type));
    }
}