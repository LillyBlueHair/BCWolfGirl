import { IController, CtrlType, TestCtrlResult, TReject, TAccept } from "..";
import { RecordsEqual, StandardItemSetRecords, DetailedItemTestRecords, StandardItemTestRecords } from "../Ctrls";

function calcRecordValue(type: CtrlType) {
    if (type === "off") return [{ typed: 0 }, { typed: 0 }];
    else if (type === "base") return [{ typed: 2 }, { typed: 2 }];
    else if (type === "total") return [{ typed: 1 }, { typed: 1 }];
    else return [];
}

export class FeetCtrl extends IController {
    readonly type = "FeetCtrl";
    readonly target_item = ["ItemFeet", "ItemLegs"];
    available_ctrls: CtrlType[] = ["off", "base", "total"];

    set(player: Character, item: Item[], type: CtrlType): void {
        StandardItemSetRecords(player, item, calcRecordValue(type));
    }

    test(player: Character, item: Item[], type: CtrlType): TestCtrlResult {
        return StandardItemTestRecords(item, calcRecordValue(type));
    }
}