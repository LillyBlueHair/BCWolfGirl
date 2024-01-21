import { CtrlType, IController } from "../ICtrl";


export class ToysCtrl extends IController {
    readonly type = "ToysCtrl";
    readonly target_item = [];
    set(player: Character, item: Item[], type: CtrlType): void {
        const target = (() => {
            if (type === "open") return 2;
            if (type === "max") return 4;
            return 0;
        })()

        player.Appearance.filter(i => i.Asset.Group.Category === "Item").forEach(i => {
            if (i.Asset.Archetype === "vibrating")
                ExtendedItemSetOptionByRecord(player, i, { vibrating: target })
            else if (i.Asset.Archetype === "modular") {
                const old_record = i.Property?.TypeRecord;
                if (!old_record || !old_record.i) return;
                old_record.i = target;
                ExtendedItemSetOptionByRecord(player, i, old_record);
            }
        })
    }
}