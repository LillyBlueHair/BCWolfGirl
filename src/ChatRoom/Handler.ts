import { InitDressSequence } from "../Control/Sequence";
import { ActivityDeconstruct, ActivityInfo } from "../utils/ChatMessages";

type HandleFunction = (player: Character, sender: Character, data: IChatRoomMessage) => void;

export function ChatRoomChatRawHandler(player: Character, data: IChatRoomMessage) {
    if (player.GhostList && player.GhostList.indexOf(data.Sender) >= 0) return;
    let sender = ChatRoomCharacter.find(c => c.MemberNumber == data.Sender);
    if (sender === undefined) return;
    if (data.Type === "Chat") ChatRoomChat(player, sender, data.Content);
    if (data.Type === "Activity") {
        if (!data.Dictionary) return;
        const d = ActivityDeconstruct(data.Dictionary);
        if (!d) return;
        ChatRoomActivity(player, sender, d);
    }
}

function ChatRoomChat(player: Character, sender: Character, msg: string) {

}

function ChatRoomActivity(player: Character, sender: Character, data: ActivityInfo) {
    if (sender.MemberNumber === player.MemberNumber && data.ActivityName === "Inject" && data.SourceCharacter.MemberNumber === player.MemberNumber) {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === data.TargetCharacter.MemberNumber);
        if (!target) return;
        InitDressSequence(player, target);
    }
}