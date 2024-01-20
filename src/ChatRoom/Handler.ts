import { InitDressSequence } from "../Control/Sequence";
import { IsPlayerWolfGirl } from "../Control/WolfGirlCtrl";
import { ActivityDeconstruct, ActivityInfo } from "../utils/ChatMessages";
import { RunCommands } from "./Commands";

type HandleFunction = (player: Character, sender: Character, data: ServerChatRoomMessage) => void;

export function ChatRoomHandler(): ChatRoomMessageHandler {
    return {
        Description: "WolfGirl Message Hook",
        Priority: 10, // 100 = deprevation starts
        Callback: (data, sender, msg, metadata) => {
            if (Player && Player.MemberNumber) {
                if (data.Type === "Chat" || data.Type === "Whisper") {
                    if (!ChatRoomMapVisible || ChatRoomMapCharacterIsHearable(sender))
                        ChatRoomChat(Player, sender, data.Content);
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

    if (IsPlayerWolfGirl(player)) RunCommands(player, data.MemberNumber, data.Message);
}


function ChatRoomChat(player: Character, sender: Character, msg: string) {
    if (IsPlayerWolfGirl(player)) RunCommands(player, sender, msg);
}

function ChatRoomActivity(player: Character, sender: Character, data: ActivityInfo) {
    if (sender.MemberNumber === player.MemberNumber && data.ActivityName === "Inject" && data.SourceCharacter.MemberNumber === player.MemberNumber) {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === data.TargetCharacter.MemberNumber);
        if (!target) return;
        InitDressSequence(player, target);
    }
}