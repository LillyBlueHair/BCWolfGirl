import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { IsPlayerWolfGirl } from "../Check";
import { CtrlType, IController } from "../ICtrl";
import { BCX_ORIGINAL_MESSAGE } from "../../../BCInterface";

export class HearingCtrl extends IController {
    readonly target_item = ["ItemEars"];

    set(player: Character, item: Item[], type: CtrlType) {
        const [ear] = item;
        if (type === "off") ExtendedItemSetOptionByRecord(player, ear, { typed: 0 });
        else if (type === "base") ExtendedItemSetOptionByRecord(player, ear, { typed: 1 });
        else if (type === "total") ExtendedItemSetOptionByRecord(player, ear, { typed: 3 });
    }

    hook(mod: ModSDKModAPI) {
        mod.hookFunction("ChatRoomMessage", 1, (args, next) => {
            const data: ServerChatRoomMessage = args[0];
            if (data.Type === "Chat") {
                if (Player && Player.MemberNumber && IsPlayerWolfGirl(Player)) {
                    const item = Player.Appearance.find(e => e.Asset.Group.Name === "ItemEars") as Item;
                    const typed = item?.Property?.TypeRecord?.typed;
                    if (typed !== undefined && typed > 0 && data.Dictionary) {
                        data.Dictionary = data.Dictionary.filter(e => e.Tag !== BCX_ORIGINAL_MESSAGE);
                    }
                }
            }
            next(args);
        });
    }
}