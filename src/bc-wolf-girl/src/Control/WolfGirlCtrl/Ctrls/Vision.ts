import { CtrlType } from "../IController";
import { TestCtrlResult } from "../IController";
import { IController } from "../IController";
import { StandardItemSetRecords } from "../IController";
import { StandardItemTestRecords } from "../IController";

function calcRecordValue(type: CtrlType): TypeRecord[] {
    if (type === "off") return [{ typed: 0 }];
    else if (type === "base") return [{ typed: 1 }];
    else if (type === "total") return [{ typed: 3 }];
    else return [];
}

export class VisionCtrl extends IController {
    readonly type = "VisionCtrl";
    readonly target_item: AssetGroupItemName[] = ["ItemHead"];
    readonly available_ctrls: CtrlType[] = ["off", "base", "total"];

    set(player: PlayerCharacter, item: (Item | undefined)[], type: CtrlType): void {
        StandardItemSetRecords(player, item, calcRecordValue(type));
    }

    test(player: PlayerCharacter, item: Item[], type: CtrlType): TestCtrlResult {
        return StandardItemTestRecords(item, calcRecordValue(type));
    }
}