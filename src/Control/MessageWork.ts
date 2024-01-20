import { ChatRoomAction } from "../utils/ChatMessages";
import { TimedWork } from "./Worker";
import { TimedWorkState } from "./Worker";

export type MessageWorkMode = "action" | "chat-action" | "local" | "chat";

export class MessageWork extends TimedWork {
    private _message: string;
    private _mode: MessageWorkMode;
    private _target?: number;
    constructor(readonly mode: MessageWorkMode, readonly message: string, target?: number | Character) {
        super();
        this._message = message;
        this._mode = mode;
        this._target = typeof target === "number" ? target : target?.MemberNumber;
    }

    run(player: Character): TimedWorkState {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === this._target);
        const parsed = this._message.replace(/{(target|target_id|player|player_id)}/g, (match, p1) => {
            if (target) {
                if (p1 === "target") return CharacterNickname(target);
                if (p1 === "target_id") return target.MemberNumber.toString();
            }
            if (p1 === "player") return CharacterNickname(player);
            if (p1 === "player_id") return player.MemberNumber.toString();
            return match;
        });

        if (this._mode === "action") {
            ChatRoomAction.instance.ServerAction(parsed);
        } else if (this._mode === "chat-action") {
            ChatRoomAction.instance.ServerAction("\"" + parsed + "\"");
        } else if (this._mode === "local") {
            ChatRoomAction.instance.LocalAction(parsed);
        } else if (this._mode === "chat") {
            ChatRoomAction.instance.ServerChat(parsed);
        }
        return TimedWorkState.finished;
    }
}

