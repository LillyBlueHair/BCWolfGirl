import { CtrlType, IController, TestCtrlResult } from "..";
import { StandardItemSetRecords, StandardItemTestRecords } from "../Ctrls";

function calcRecordValue(type: CtrlType): TypeRecord[] {
    if (type === "off") return [{ g: 0, p: 0, t: 0 }];
    else if (type === "base") return [{ g: 0, p: 3, t: 0 }];
    else if (type === "total") return [{ g: 2, p: 3, t: 4 }];
    else return [];
}

export class VoiceCtrl extends IController {
    readonly type = "VoiceCtrl";
    readonly target_item = ["ItemMouth"];
    readonly available_ctrls: CtrlType[] = ["off", "base", "total"];

    set(player: Character, item: (Item | undefined)[], type: CtrlType): void {
        StandardItemSetRecords(player, item, calcRecordValue(type));
    }

    test(player: Character, item: Item[], type: CtrlType): TestCtrlResult {
        return StandardItemTestRecords(item, calcRecordValue(type));
    }
}