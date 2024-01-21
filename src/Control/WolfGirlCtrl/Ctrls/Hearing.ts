import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { IsPlayerWolfGirl } from "../Check";
import { CtrlType, IController } from "../ICtrl";
import { BCX_ORIGINAL_MESSAGE, GAGBYPASSINDICATOR } from "../../../BCInterface";
import { CUSTOM_ACTION_TAG } from "../../../Definition";


function ChatOrWhisperToWolfGirl(data: ServerChatRoomMessage, then: (player: Character, sender: Character) => void) {
    if (data.Type === "Chat" || data.Type === "Whisper") {
        const sender = ChatRoomCharacter.find(c => c.MemberNumber === data.Sender);
        if (sender && Player && Player.MemberNumber && IsPlayerWolfGirl(Player)) {
            const item = Player.Appearance.find(e => e.Asset.Group.Name === "ItemEars") as Item;
            const typed = item?.Property?.TypeRecord?.typed;
            if (typed !== undefined && typed > 0) then(Player, sender);
        }
    }
}


export class HearingCtrl extends IController {
    readonly type = "HearingCtrl";
    readonly target_item = ["ItemEars"];
    set(player: Character, item: Item[], type: CtrlType) {
        const [ear] = item;
        if (type === "off") ExtendedItemSetOptionByRecord(player, ear, { typed: 0 });
        else if (type === "base") ExtendedItemSetOptionByRecord(player, ear, { typed: 1 });
        else if (type === "total") ExtendedItemSetOptionByRecord(player, ear, { typed: 3 });
    }

    hook(mod: ModSDKModAPI) {
        mod.hookFunction("ChatRoomMessage", 1, (args, next) => {
            const [data] = args as [ServerChatRoomMessage];
            ChatOrWhisperToWolfGirl(data, (player, sender) => {
                (data as any)[CUSTOM_ACTION_TAG] = mod.callOriginal("SpeechGarble", [sender, data.Content]);
            });

            return next(args);
        });

        mod.hookFunction("ChatRoomMessageDisplay", 1, (args, next) => {
            const typedArgs = args as [ServerChatRoomMessage, string, Character, any];
            ChatOrWhisperToWolfGirl(typedArgs[0], () => {
                typedArgs[1] = (typedArgs[0] as any)[CUSTOM_ACTION_TAG] ?? typedArgs[1];
            });
            return next(typedArgs);
        });
    }
}