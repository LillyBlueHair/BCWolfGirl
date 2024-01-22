import { InitDressSequence } from "../Control/CtrlSequence";
import { ActivityDeconstruct, ActivityInfo } from "../utils/ChatMessages";
import { RunCommands } from "./Run";
import { CommandType } from "./ICmds";
import { TaskCtrl } from "../Control/TaskCtrl/TaskCtrl";
import { RunActivityHandlers } from "./Activity";

export function ChatRoomHandler(): ChatRoomMessageHandler {
    return {
        Description: "WolfGirl Message Hook",
        Priority: 10, // 100 = deprevation starts
        Callback: (data, sender, msg, metadata) => {
            if (Player && Player.MemberNumber) {
                if (data.Type === "Chat" || data.Type === "Whisper") {
                    if (!ChatRoomMapVisible || ChatRoomMapCharacterIsHearable(sender))
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

export function BeepRawHandler(player: Character, data: { MemberNumber?: number, MemberName?: string, ChatRoom?: string, Message?: string }) {
    if (!data.MemberName || !data.MemberNumber || !data.Message) return;
    if (player.GhostList && player.GhostList.indexOf(data.MemberNumber) >= 0) return;

    RunCommands(player, data.MemberNumber, data.Message, { type: "Beep", "BeepRoom": data.ChatRoom });
}


function ChatRoomChat(player: Character, sender: Character, msg: string, type: CommandType) {
    RunCommands(player, sender, msg, { type });
}

function ChatRoomActivity(player: Character, sender: Character, data: ActivityInfo) {
    RunActivityHandlers(player, sender, data);
    TaskCtrl.instance.onActivity(player, sender, data);
}