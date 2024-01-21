import { ExtractMemberNumber } from "../utils/Character";
import { ChatRoomAction } from "../utils/ChatMessages";
import { CommandType } from "./ICmds";

export function RouteIM(target: Character | number, type: CommandType, msg: string) {
    const tnum = ExtractMemberNumber(target);

    if (type === "Chat") {
        ChatRoomAction.instance.SendAction(msg);
    } else if (type === "Whisper") {
        ChatRoomAction.instance.SendWhisper(tnum, msg);
        ChatRoomAction.instance.LocalAction("已发送");
    } else if (type === "Beep") {
        ChatRoomAction.instance.SendBeep(tnum, msg);
    }
}