import { CtrlType, IController, TAccept, TReject, TestCtrlResult } from "..";

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
    readonly target_item = ["ItemNeck"];
    readonly available_ctrls: CtrlType[] = ["open", "close"];

    set(player: Character, item: Item[], type: CtrlType): void {
        const [collar] = item;
        if (!collar.Property) collar.Property = {};
        if (type === "open") {
            Object.assign(collar.Property, props.open)
        }
        else if (type === "close") {
            Object.assign(collar.Property, props.close)
        }
    }

    test(player: Character, item: Item[], type: CtrlType): TestCtrlResult {
        const [collar] = item;
        const collar_props = collar.Property;
        if (!collar_props) return TReject("itemprop");

        const target_props = type === "open" ? props.open : props.close;
        const filtered = Object.keys(target_props).map(k => collar_props[k as keyof ItemProperty] === (target_props as any)[k]);
        if (filtered.every(i => i)) return TReject("unchanged");
        return TAccept();
    }
}