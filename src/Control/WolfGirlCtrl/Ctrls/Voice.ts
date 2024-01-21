import { CtrlType, IController } from "../ICtrl";

export class VoiceCtrl extends IController {
    readonly type = "VoiceCtrl";
    readonly target_item = ["ItemMouth"];

    set(player: Character, item: Item[], type: CtrlType): void {
        const [mouth] = item;
        if (type === "off") ExtendedItemSetOptionByRecord(player, mouth, { g: 0, p: 0, t: 0 });
        else if (type === "base") ExtendedItemSetOptionByRecord(player, mouth, { g: 0, p: 3, t: 0 });
        else if (type === "total") ExtendedItemSetOptionByRecord(player, mouth, { g: 2, p: 3, t: 4 });
    }
}