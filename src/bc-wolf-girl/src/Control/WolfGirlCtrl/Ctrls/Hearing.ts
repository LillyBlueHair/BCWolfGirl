import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { IsPlayerWolfGirl } from "../Check";
import { CtrlType } from "../IController";
import { TestCtrlResult } from "../IController";
import { IController } from "../IController";
import { CUSTOM_ACTION_TAG } from "../../../Definition";
import { StandardItemSetRecords } from "../IController";
import { StandardItemTestRecords } from "../IController";

function ChatOrWhisperToWolfGirl(data: ServerChatRoomMessage, then: (player: PlayerCharacter, sender: Character) => void) {
    if (data.Type === "Chat" || data.Type === "Whisper") {
        const sender = ChatRoomCharacter.find(c => c.MemberNumber === data.Sender);
        if (sender && Player && Player.MemberNumber && IsPlayerWolfGirl(Player)) {
            const item = Player.Appearance.find(e => e.Asset.Group.Name === "ItemEars") as Item;
            const typed = item?.Property?.TypeRecord?.typed;
            if (typed !== undefined && typed > 0) then(Player, sender);
        }
    }
}

function calcRecordValue(type: CtrlType): TypeRecord[] {
    if (type === "off") return [{ typed: 0 }];
    else if (type === "base") return [{ typed: 1 }];
    else if (type === "total") return [{ typed: 3 }];
    else return [{ typed: 0 }];
}

export class HearingCtrl extends IController {
    readonly type = "HearingCtrl";
    readonly target_item: AssetGroupItemName[] = ["ItemEars"];
    readonly available_ctrls: CtrlType[] = ["off", "base", "total"];

    set(player: PlayerCharacter, item: (Item | undefined)[], type: CtrlType) {
        StandardItemSetRecords(player, item, calcRecordValue(type));
    }

    test(player: PlayerCharacter, item: Item[], type: CtrlType): TestCtrlResult {
        return StandardItemTestRecords(item, calcRecordValue(type));
    }

    hook(mod: ModSDKModAPI, lateHook: (callback: () => void) => void) {
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