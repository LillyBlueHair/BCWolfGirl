import { ActivityDeconstruct, ActivityInfo } from "../bc-utilities/ChatMessages";
import { RunCommands } from "./Run";
import { CommandType } from "./ICmds";
import { TaskCtrl } from "../Control/TaskCtrl/TaskCtrl";
import { RunActivityHandlers } from "./Activity";

export function ChatRoomHandler(): ChatRoomMessageHandler {
    return {
        Description: "WolfGirl Message Hook",
        Priority: 1024, // 100 = deprevation starts, 500 = show on chatlog
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

export function BeepRawHandler(player: Character, data: ServerBeepData) {
    if (!data.MemberName || !data.MemberNumber || !data.Message) return;
    if (player.GhostList && player.GhostList.indexOf(data.MemberNumber) >= 0) return;

    const room = (() => {
        if (data.ChatRoomName !== undefined && data.ChatRoomSpace !== undefined) return { name: data.ChatRoomName, space: data.ChatRoomSpace };
        return undefined;
    })();

    RunCommands(player, data.MemberNumber, data.Message, { type: "Beep", BeepRoom: room });
}


function ChatRoomChat(player: Character, sender: Character, msg: string, type: CommandType) {
    RunCommands(player, sender, msg, { type });
}

function ChatRoomActivity(player: Character, sender: Character, data: ActivityInfo) {
    RunActivityHandlers(player, sender, data);
    TaskCtrl.instance.onActivity(player, sender, data);
}