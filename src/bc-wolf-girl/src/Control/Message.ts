import { CommandType } from "../ChatRoom/ICmds";
import { ExtractMemberNumber } from "../utils/Character";
import { ChatRoomAction } from "bc-utilities";
import { GetWolfGirlName } from "./WolfGirlCtrl";

export interface IMessage {
    mode: IMessageMode;
    msg: string;
}

export type IMessageMode = "action" | "chat-action" | "local" | "chat" | "local-status";

export function FormatMessage(msg: string, src?: { player?: Character, target?: Character }, args?: { [key: string]: any }) {
    if (!src) src = {};
    return msg.replace(/{([\w\d_]+)}/g, (match, p1) => {
        if (src?.target) {
            if (p1 === "target") return CharacterNickname(src.target);
            if (p1 === "target_id") return src.target.MemberNumber?.toString() ?? "";
            if (p1 === "target_wg") return GetWolfGirlName(src.target);
        }
        if (src?.player) {
            if (p1 === "player") return CharacterNickname(src.player);
            if (p1 === "player_id") return src.player.MemberNumber?.toString() ?? "";
            if (p1 === "player_wg") return GetWolfGirlName(src.player);
        }
        if (args && args[p1]) {
            return args[p1].toString();
        }
        return match;
    });
}

export function ParseMessage(option: IMessage, src?: { player?: Character, target?: Character }, args?: { [key: string]: any }) {
    const formated = FormatMessage(option.msg, src, args);
    if (option.mode === "action") {
        ChatRoomAction.instance.SendAction(formated);
    } else if (option.mode === "chat-action") {
        ChatRoomAction.instance.SendAction("\"" + formated + "\"");
    } else if (option.mode === "local") {
        ChatRoomAction.instance.LocalAction(formated);
    } else if (option.mode === "chat") {
        ChatRoomAction.instance.SendChat(formated);
    } else if (option.mode === "local-status") {
        ChatRoomAction.instance.LocalInfo(formated);
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

export function RouteIM(type: CommandType, player: PlayerCharacter, target: number | Character, msg: string, args?: { [key: string]: any }) {
    const formated = FormatMessage(msg, { player }, args);
    const tnum = ExtractMemberNumber(target);
    if (type === "Chat") {
        ChatRoomAction.instance.SendAction(formated);
    } else if (type === "Whisper") {
        ChatRoomAction.instance.SendWhisper(tnum, formated);
    } else if (type === "Beep") {
        ChatRoomAction.instance.SendBeep(tnum, formated);
    }
}
