import { CtrlType, IController, TestCtrlResult } from "..";
import { StandardItemSetRecords, StandardItemTestRecords } from "../Ctrls";

function calcRecordValue(type: CtrlType): TypeRecord[] {
    if (type === "off") return [{ typed: 0 }];
    else if (type === "base") return [{ typed: 1 }];
    else if (type === "total") return [{ typed: 3 }];
    else return [];
}

export class VisionCtrl extends IController {
    readonly type = "VisionCtrl";
    readonly target_item = ["ItemHead"];
    readonly available_ctrls: CtrlType[] = ["off", "base", "total"];

    set(player: Character, item: (Item | undefined)[], type: CtrlType): void {
        StandardItemSetRecords(player, item, calcRecordValue(type));
    }

    test(player: Character, item: Item[], type: CtrlType): TestCtrlResult {
        return StandardItemTestRecords(item, calcRecordValue(type));
    }
}