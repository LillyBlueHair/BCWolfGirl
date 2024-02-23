import { ActivityDeconstruct, ActivityInfo } from "bc-utilities";
import { RunCommands } from "./Run";
import { CommandType } from "./ICmds";
import { TaskCtrl } from "../Control/TaskCtrl/TaskCtrl";
import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { ActivityProvider } from "./Activity";

export function ChatRoomHandler(): ChatRoomMessageHandler {
    return {
        Description: "WolfGirl Message Hook",
        Priority: 1024, // 100 = deprevation starts, 500 = show on chatlog
        Callback: (data, sender, msg, metadata) => {
            if (Player && Player.MemberNumber) {
                if (data.Type === "Chat" || data.Type === "Whisper") {
                    if (!ChatRoomMapViewIsActive() || ChatRoomMapViewCharacterIsHearable(sender))
                        ChatRoomChat(Player, sender, data.Content, data.Type);
                }
                if (data.Type === "Activity" && data.Dictionary) {
                    const d = ActivityDeconstruct(data.Dictionary);
                    if (d) ChatRoomActivity(Player, sender, d);
                }
            }
            return false;
        },
    }
}

export function BeepRawHandler(player: PlayerCharacter, data: ServerBeepData) {
    if (!data.MemberName || !data.MemberNumber || !data.Message) return;
    if (player.GhostList && player.GhostList.indexOf(data.MemberNumber) >= 0) return;

    const room = (() => {
        if (data.ChatRoomName !== undefined && data.ChatRoomSpace !== undefined) return { name: data.ChatRoomName, space: data.ChatRoomSpace };
        return undefined;
    })();

    RunCommands(player, data.MemberNumber, data.Message, { type: "Beep", BeepRoom: room });
}


function ChatRoomChat(player: PlayerCharacter, sender: Character, msg: string, type: CommandType) {
    RunCommands(player, sender, msg, { type });
}

function ChatRoomActivity(player: PlayerCharacter, sender: Character, data: ActivityInfo) {
    ActivityProvider.run(player, sender, data);
    TaskCtrl.instance.onActivity(player, sender, data);
}

export function OnlineMessageHandlerInit(mod: ModSDKModAPI) {
    ChatRoomRegisterMessageHandler(ChatRoomHandler());
    mod.hookFunction('ServerAccountBeep', 2, (args, next) => {
        next(args);
        if (Player) BeepRawHandler(Player, args[0]);
    });
}