import { IController, CtrlType } from "../ICtrl";

export class HandCtrl extends IController {
    target_item = ["ItemHands", "ItemArms"];
    set(player: Character, item: Item[], type: CtrlType): void {
        const [hand, arm] = item;

        if (type === "off") {
            ExtendedItemSetOptionByRecord(player, hand, { typed: 1 });
            ExtendedItemSetOptionByRecord(player, arm, { typed: 0 });
        }
        else if (type === "base") {
            ExtendedItemSetOptionByRecord(player, hand, { typed: 0 });
            ExtendedItemSetOptionByRecord(player, arm, { typed: 1 });
        }
        else if (type === "total") {
            ExtendedItemSetOptionByRecord(player, hand, { typed: 0 });
            ExtendedItemSetOptionByRecord(player, arm, { typed: 3 });
        }
    }
}