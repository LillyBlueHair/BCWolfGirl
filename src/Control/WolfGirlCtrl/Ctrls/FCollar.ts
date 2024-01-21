import { CtrlType, IController } from "../ICtrl";

export class FCollarPublic extends IController {
    readonly type = "FuturisticPublicCtrl";
    readonly target_item = ["ItemNeck"];

    set(player: Character, item: Item[], type: CtrlType): void {
        const [collar] = item;
        if (!collar.Property) collar.Property = {};
        if (type === "open") {
            Object.assign(collar.Property, {
                "OpenPermission": true,
                "OpenPermissionChastity": true,
                "OpenPermissionArm": true,
                "OpenPermissionLeg": true
            })
        }
        else if (type === "close") {
            Object.assign(collar.Property, {
                "OpenPermission": false,
                "OpenPermissionChastity": false,
                "OpenPermissionArm": false,
                "OpenPermissionLeg": false
            })
        }
    }
}