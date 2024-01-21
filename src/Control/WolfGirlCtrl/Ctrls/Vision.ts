import { CtrlType, IController } from "../ICtrl";

export class VisionCtrl extends IController {
    readonly type = "VisionCtrl";
    readonly target_item = ["ItemHead"];

    set(player: Character, item: Item[], type: CtrlType): void {
        const [visor] = item;
        if (type === "off") ExtendedItemSetOptionByRecord(player, visor, { typed: 0 });
        else if (type === "base") ExtendedItemSetOptionByRecord(player, visor, { typed: 1 });
        else if (type === "total") ExtendedItemSetOptionByRecord(player, visor, { typed: 3 });
    }
}