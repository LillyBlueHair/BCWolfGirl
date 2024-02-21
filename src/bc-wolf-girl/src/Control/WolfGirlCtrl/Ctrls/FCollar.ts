import { CtrlType } from "../IController";
import { TAccept } from "../IController";
import { TReject } from "../IController";
import { TestCtrlResult } from "../IController";
import { IController } from "../IController";

const props = {
    open: {
        "OpenPermission": true,
        "OpenPermissionChastity": true,
        "OpenPermissionArm": true,
        "OpenPermissionLeg": true
    },
    close: {
        "OpenPermission": false,
        "OpenPermissionChastity": false,
        "OpenPermissionArm": false,
        "OpenPermissionLeg": false
    }
}

export class FCollarPublic extends IController {
    readonly type = "FuturisticPublicCtrl";
    readonly target_item: AssetGroupItemName[] = ["ItemNeck"];
    readonly available_ctrls: CtrlType[] = ["open", "close"];

    set(player: PlayerCharacter, item: (Item | undefined)[], type: CtrlType): void {
        const [collar] = item;
        if (!collar) return;
        if (!collar.Property) collar.Property = {};
        if (type === "open") {
            Object.assign(collar.Property, props.open)
        }
        else if (type === "close") {
            Object.assign(collar.Property, props.close)
        }
    }

    test(player: PlayerCharacter, item: Item[], type: CtrlType): TestCtrlResult {
        const [collar] = item;
        const collar_props = collar.Property;
        if (!collar_props) return TReject("itemprop");

        const target_props = type === "open" ? props.open : props.close;
        const filtered = Object.keys(target_props).map(k => collar_props[k as keyof ItemProperties] === (target_props as any)[k]);
        if (filtered.every(i => i)) return TReject("unchanged");
        return TAccept();
    }
}