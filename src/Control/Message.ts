import { ChatRoomAction } from "../utils/ChatMessages";
import { GetWolfGrilName } from "./WolfGirlCtrl";

export interface IMessage {
    mode: IMessageMode;
    msg: string;
}

export type IMessageMode = "action" | "chat-action" | "local" | "chat" | "local-status";

export function ParseMessage(option: IMessage, src?: { player?: Character, target?: Character }, args?: { [key: string]: string }) {
    if (!src) src = {};
    const parsed = option.msg.replace(/{([\w\d_]+)}/g, (match, p1) => {
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
        if (args && args[p1]) {
            return args[p1];
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
    } else if (option.mode === "local-status") {
        ChatRoomAction.instance.LocalInfo(parsed);
    }
}

export function MessageSimWrongCoding(src: string, weight: number) {
    const WrongCodingSrc: string[] = [
        "�", "�2�", "□��",
        "??", "????", "??????",
        "烫烫", "烫烫烫", "烫烫烫烫", "烫烫烫烫烫",
        "ììð", "ñâââ", "îýîú", "ýýýÿÿÿ",
    ]

    const replace = (c: string, idx: number) => {
        const p = idx / src.length * weight * 0.5 + weight * 0.5;
        if (Math.random() < p) {
            return WrongCodingSrc[Math.floor(Math.random() * WrongCodingSrc.length)];
        }
        return c;
    };

    return src.split('').map(replace).join('');
}