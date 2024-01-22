import { ChatRoomAction } from "../utils/ChatMessages";
import { GetWolfGrilName } from "./WolfGirlCtrl";

export interface IMessage {
    mode: IMessageMode;
    msg: string;
}

export type IMessageMode = "action" | "chat-action" | "local" | "chat";

export function ParseMessage(option: IMessage, src?: { player?: Character, target?: Character }) {
    if (!src) src = {};
    const parsed = option.msg.replace(/{(target|target_id|target_wg|player|player_id|player_wg)}/g, (match, p1) => {
        if (src?.target) {
            if (p1 === "target") return CharacterNickname(src.target);
            if (p1 === "target_id") return src.target.MemberNumber.toString();
            if (p1 === "target_wg") return GetWolfGrilName(src.target);
        }
        if (src?.player) {
            if (p1 === "player") return CharacterNickname(src.player);
            if (p1 === "player_id") return src.player.MemberNumber.toString();
            if (p1 === "player_wg") return GetWolfGrilName(src.player);
        }
        return match;
    });
    if (option.mode === "action") {
        ChatRoomAction.instance.SendAction(parsed);
    } else if (option.mode === "chat-action") {
        ChatRoomAction.instance.SendAction("\"" + parsed + "\"");
    } else if (option.mode === "local") {
        ChatRoomAction.instance.LocalAction(parsed);
    } else if (option.mode === "chat") {
        ChatRoomAction.instance.SendChat(parsed);
    }
}

