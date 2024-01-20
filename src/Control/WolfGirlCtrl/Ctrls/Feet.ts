import { IController, CtrlType } from "../ICtrl";

export class FeetCtrl extends IController {
    target_item = ["ItemFeet", "ItemLegs"];

    set(player: Character, item: Item[], type: CtrlType): void {
        const [lower_leg, upper_leg] = item;

        if (type === "off") {
            ExtendedItemSetOptionByRecord(player, upper_leg, { typed: 0 });
            ExtendedItemSetOptionByRecord(player, lower_leg, { typed: 0 });
        }
        else if (type === "base") {
            ExtendedItemSetOptionByRecord(player, upper_leg, { typed: 2 });
            ExtendedItemSetOptionByRecord(player, lower_leg, { typed: 2 });
        }
        else if (type === "total") {
            ExtendedItemSetOptionByRecord(player, upper_leg, { typed: 1 });
            ExtendedItemSetOptionByRecord(player, lower_leg, { typed: 1 });
        }
    }
}