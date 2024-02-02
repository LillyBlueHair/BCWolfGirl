import { CtrlType } from "../IController";
import { TAccept } from "../IController";
import { TReject } from "../IController";
import { TestCtrlResult } from "../IController";
import { IController } from "../IController";

function calcValue(type: CtrlType): number {
    if (type === "off") return 0;
    else if (type === "open") return 2;
    else if (type === "max") return 4;
    else return 0;
}

export class ToysCtrl extends IController {
    readonly type = "ToysCtrl";
    readonly target_item = ["ItemVulva", "ItemPelvis", "ItemVulvaPiercings", "ItemButt", "ItemNipples", "ItemNipplesPiercings"];
    readonly available_ctrls: CtrlType[] = ["open", "max", "off", "random"];

    set(player: Character, item: (Item | undefined)[], type: CtrlType): void {
        if (type !== "random") {
            const target = calcValue(type);
            item.forEach(i => {
                if (!i) return;
                if (i.Asset.Archetype === "vibrating")
                    ExtendedItemSetOptionByRecord(player, i, { vibrating: target })
                else if (i.Asset.Archetype === "modular") {
                    const old_record = i.Property?.TypeRecord;
                    if (!old_record || !old_record.i) return;
                    ExtendedItemSetOptionByRecord(player, i, { i: target });
                }
            })
        } else {
            item.forEach(i => {
                if (!i) return;
                if (i.Asset.Archetype === "vibrating")
                    ExtendedItemSetOptionByRecord(player, i, { vibrating: 5 });
                else if (i.Asset.Archetype === "modular") {
                    const old_record = i.Property?.TypeRecord;
                    if (!old_record || !old_record.i) return;
                    ExtendedItemSetOptionByRecord(player, i, { i: 0 });
                }
            })
        }
    }

    test(player: Character, item: Item[], type: CtrlType): TestCtrlResult {
        if (type === "random") return TAccept();

        const target = calcValue(type);
        if (item.every(i => {
            if (i.Asset.Archetype === "vibrating") {
                if (i.Property?.TypeRecord?.vibrating === target) return false;
            } else if (i.Asset.Archetype === "modular") {
                if (i.Property?.TypeRecord?.i === target) return false;
            }
            return true;
        })) return TReject("unchanged");
        return TAccept();
    }
}