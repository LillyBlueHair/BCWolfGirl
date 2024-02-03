import { CtrlType } from "../IController";
import { TestCtrlResult } from "../IController";
import { IController } from "../IController";
import { StandardItemSetRecords } from "../IController";
import { StandardItemTestRecords } from "../IController";

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
        const target = calcRecordValue(type);
        const [mouth] = item;
        const oldg = mouth?.Property?.TypeRecord?.g;
        StandardItemSetRecords(player, item, target);
        if (target[0].g !== oldg && mouth?.Property?.AutoPunishUndoTime !== undefined)
            mouth.Property.AutoPunishUndoTime = 0;
    }

    test(player: Character, item: Item[], type: CtrlType): TestCtrlResult {
        return StandardItemTestRecords(item, calcRecordValue(type));
    }
}