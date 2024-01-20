import { CtrlType, IController } from "../ICtrl";

export class ArousalCtrl extends IController {
    target_item = ["ItemPelvis"];
    set(player: Character, item: Item[], type: CtrlType): void {
        const [pelvis] = item;
        const oldtype = pelvis.Property?.TypeRecord;
        if (!oldtype) return;

        if (type === "off") {
            oldtype["o"] = 0;
        }
        else if (type === "edge") {
            oldtype["o"] = 1;
        }
        else if (type === "deny") {
            oldtype["o"] = 2;
        }
        ExtendedItemSetOptionByRecord(player, pelvis, oldtype);
    }
}