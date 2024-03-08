import { ActivityDeconstruct, ActivityInfo, ChatRoomHandler } from "bc-utilities";
import { RunCommands } from "./Run";
import { CommandType } from "./ICmds";
import { TaskCtrl } from "../Control/TaskCtrl/TaskCtrl";
import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { ActivityProvider } from "./Activity";

export function BeepRawHandler(player: PlayerCharacter, data: ServerBeepData) {
    if (!data.MemberName || !data.MemberNumber || !data.Message) return;
    if (player.GhostList && player.GhostList.indexOf(data.MemberNumber) >= 0) return;

    const room = (() => {
        if (data.ChatRoomName !== undefined && data.ChatRoomSpace !== undefined) return { name: data.ChatRoomName, space: data.ChatRoomSpace };
        return undefined;
    })();

    RunCommands(player, data.MemberNumber, data.Message, { type: "Beep", BeepRoom: room });
}


function ChatRoomChat(player: PlayerCharacter, sender: Character, msg: string, type: string) {
    if (type === "Chat" || type === "Whisper") RunCommands(player, sender, msg, { type });
}

function ChatRoomActivity(player: PlayerCharacter, sender: Character, data: ActivityInfo) {
    ActivityProvider.run(player, sender, data);
    TaskCtrl.instance.onActivity(player, sender, data);
}

export function BeepHandler(mod: ModSDKModAPI) {
    mod.hookFunction('ServerAccountBeep', 2, (args, next) => {
        next(args);
        if (Player) BeepRawHandler(Player, args[0]);
    });
}

export function ChatHandler(handler: ChatRoomHandler) {
    handler.onReceiveActivity(ChatRoomActivity);
    handler.onReceiveChatWhisperEmote(ChatRoomChat);
}