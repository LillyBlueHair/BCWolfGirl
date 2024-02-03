import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { TimedWork, TimedWorkState } from "../Worker";

interface ChatRoomWorkSearchTask {
    join: (data: any) => void;
}

interface ChatRoomWorkSyncTask {
    cleanup: (data: any) => void;
}

type ChatRoomWorkFailState = "notfound" | "full" | "banned" | "rejected" | "not_target";

export class ChatRoomWork extends TimedWork {
    _state: TimedWorkState = TimedWorkState.running;

    constructor(readonly join: string | undefined, readonly onfailed?: (player: Character, reason: ChatRoomWorkFailState) => void, readonly onfinished?: (player: Character, dest: string | undefined) => void) {
        super();
    }

    run(player: Character): TimedWorkState {
        ChatRoomLeave();
        CommonSetScreen("Online", "ChatSearch");

        if (this.join === undefined) {
            ChatRoomPlayerCanJoin = true;
            ChatRoomWork.chatRoomWorkSearchTasks.push({
                join: (data) => {
                    this.onfinished && this.onfinished(player, this.join);
                    this._state = TimedWorkState.finished;
                }
            });
        } else {
            ChatRoomPlayerCanJoin = false;

            ChatRoomWork.chatRoomWorkSearchTasks.push({
                join: (data) => {
                    const target = ChatSearchResult.find(e => e.Name === this.join);
                    this._state = TimedWorkState.interrupted;
                    if (!target) this.onfailed && this.onfailed(player, "notfound");
                    else if (target.MemberCount >= target.MemberLimit) this.onfailed && this.onfailed(player, "full");
                    else {
                        ServerSend("ChatRoomJoin", { Name: this.join });
                        this._state = TimedWorkState.running;
                    }
                }
            });

            ChatRoomWork.chatRoomWorkSyncTasks.push({
                cleanup: (data) => {
                    if (ChatRoomData.Name === this.join) {
                        this.onfinished && this.onfinished(player, this.join);
                        this._state = TimedWorkState.finished;
                    } else {
                        this.onfailed && this.onfailed(player, "not_target");
                        this._state = TimedWorkState.interrupted;
                    }
                }
            });
        }
        return this._state;
    }


    static readonly chatRoomWorkSearchTasks: ChatRoomWorkSearchTask[] = [];
    static readonly chatRoomWorkSyncTasks: ChatRoomWorkSyncTask[] = [];

    static init(mod: ModSDKModAPI) {
        mod.hookFunction("ChatSearchResultResponse", 1, (args, next) => {
            next(args);
            ChatRoomPlayerCanJoin = true;
            while (this.chatRoomWorkSearchTasks.length > 0) {
                this.chatRoomWorkSearchTasks.shift()?.join(args[0]);
            }
        });

        mod.hookFunction("ChatRoomSync", 1, (args, next) => {
            next(args);
            while (this.chatRoomWorkSyncTasks.length > 0) {
                this.chatRoomWorkSyncTasks.shift()?.cleanup(args[0]);
            }
        });
    }
}