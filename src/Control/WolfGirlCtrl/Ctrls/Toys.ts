import { CtrlType, IController, TAccept, TReject, TestCtrlResult } from "..";

function calcValue(type: CtrlType): number {
    if (type === "off") return 0;
    else if (type === "open") return 2;
    else if (type === "max") return 4;
    else return 0;
}

export class ToysCtrl extends IController {
    readonly type = "ToysCtrl";
    readonly target_item = ["ItemVulva"];
    readonly available_ctrls: CtrlType[] = ["open", "max", "off"];

    set(player: Character, item: (Item | undefined)[], type: CtrlType): void {
        const target = calcValue(type);
        player.Appearance.filter(i => i.Asset.Group.Category === "Item").forEach(i => {
            if (i.Asset.Archetype === "vibrating")
                ExtendedItemSetOptionByRecord(player, i, { vibrating: target })
            else if (i.Asset.Archetype === "modular") {
                const old_record = i.Property?.TypeRecord;
                if (!old_record || !old_record.i) return;
                ExtendedItemSetOptionByRecord(player, i, { i: target });
            }
        })
    }

    test(player: Character, item: Item[], type: CtrlType): TestCtrlResult {
        const target = calcValue(type);
        const qualified = player.Appearance.filter(i => i.Asset.Group.Category === "Item")
            .filter(i => i.Asset.Archetype === "vibrating" || (i.Asset.Archetype === "modular" && i.Property?.TypeRecord?.i))
        if (qualified.length === 0) return TReject("unchanged");
        if (qualified.every(i => {
            if (i.Asset.Archetype === "vibrating") {
                return i.Property?.TypeRecord?.vibrating === target;
            } else {
                return i.Property?.TypeRecord?.i === target;
            }
        })) return TReject("unchanged");
        return TAccept();
    }
}