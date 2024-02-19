import { CtrlType } from "../IController";
import { TAccept } from "../IController";
import { TReject } from "../IController";
import { TestCtrlResult } from "../IController";
import { IController } from "../IController";

function calcValue(type: CtrlType): number {
    if (type === "off") return 0;
    else if (type === "open") return 2;
    else if (type === "max") return 4;
    else if (type === "random") return 5;
    else return 0;
}

export class ToysCtrl extends IController {
    readonly type = "ToysCtrl";
    readonly target_item = ["ItemVulva", "ItemPelvis", "ItemVulvaPiercings", "ItemButt", "ItemNipples", "ItemNipplesPiercings"];
    readonly available_ctrls: CtrlType[] = ["open", "max", "off", "random"];

    set(player: PlayerCharacter, item: (Item | undefined)[], type: CtrlType): void {
        const target = calcValue(type);
        item.forEach(i => {
            if (!i) return;
            if (i.Asset.Archetype === "vibrating")
                ExtendedItemSetOptionByRecord(player, i, { vibrating: target })
            else if (i.Asset.Archetype === "modular") {
                if (i.Property?.TypeRecord?.i === undefined) return;
                if (type === "random") ExtendedItemSetOptionByRecord(player, i, { i: 0 });
                else ExtendedItemSetOptionByRecord(player, i, { i: target });
            }
        });
    }

    test(player: PlayerCharacter, item: Item[], type: CtrlType): TestCtrlResult {
        if (type === "random") return TAccept();

        const target = calcValue(type);
        if (item.every(i => {
            if (i.Asset.Archetype === "vibrating") {
                if (i.Property?.TypeRecord?.vibrating === target) return true;
            } else if (i.Asset.Archetype === "modular") {
                if (i.Property?.TypeRecord?.i === target) return true;
            }
            return false;
        })) return TReject("unchanged");
        return TAccept();
    }
}