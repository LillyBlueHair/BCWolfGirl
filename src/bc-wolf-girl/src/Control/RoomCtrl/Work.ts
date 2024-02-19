import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { TimedWork, TimedWorkState } from "../Worker";

interface ChatRoomWorkSearchTask {
    join: (data: any) => void;
}

interface ChatRoomWorkSyncTask {
    cleanup: (data: any) => void;
}

interface ChatRoomWorkTask {
    once_before_ChatSearchQuery?: () => void;
    once_after_ChatSearchResultResponse: () => void;
    once_after_ChatRoomSync?: () => void;
}

type ChatRoomWorkFailState = "notfound" | "full" | "banned" | "rejected" | "not_target";

export class ChatRoomWork extends TimedWork {
    _state: TimedWorkState = TimedWorkState.running;
    _first_run: boolean = true;

    constructor(readonly room: { name: string, space: ServerChatRoomSpace } | undefined, readonly onfailed?: (player: PlayerCharacter, reason: ChatRoomWorkFailState) => void, readonly onfinished?: (player: PlayerCharacter, dest: string | undefined) => void) {
        super();
    }

    run(player: PlayerCharacter): TimedWorkState {
        if (!this._first_run) {
            return this._state;
        }
        this._first_run = false;
        if (this.room === undefined) {
            ChatRoomPlayerCanJoin = true;
            const work: ChatRoomWorkTask = {
                once_after_ChatSearchResultResponse: () => {
                    this.onfinished?.(player, undefined);
                    this._state = TimedWorkState.finished;
                }
            }
            ChatRoomWork.chatRoomWorkSearchResultTasks.push(work);
            CommonSetScreen("Online", "ChatSearch");
        } else {
            const cj = this.room;
            ChatRoomPlayerCanJoin = false;
            const work: ChatRoomWorkTask = {
                once_before_ChatSearchQuery: () => {
                    ChatRoomSpace = cj.space;
                    ElementValue("InputSearch", cj.name);
                },
                once_after_ChatSearchResultResponse: () => {
                    const target = ChatSearchResult.find(e => e.Name === cj.name);
                    this._state = TimedWorkState.interrupted;
                    if (!target) this.onfailed?.(player, "notfound");
                    else if (target.MemberCount >= target.MemberLimit) this.onfailed?.(player, "full");
                    else {
                        ServerSend("ChatRoomJoin", { Name: cj.name });
                        this._state = TimedWorkState.running;
                    }
                },
                once_after_ChatRoomSync: () => {
                    if (ChatRoomData && ChatRoomData.Name === cj.name) {
                        this.onfinished?.(player, cj.name);
                        this._state = TimedWorkState.finished;
                    } else {
                        this.onfailed?.(player, "not_target");
                        this._state = TimedWorkState.interrupted;
                    }
                }
            }

            ChatRoomWork.chatRoomWorkSearchQueryTasks.push(work);
            ChatRoomWork.chatRoomWorkSearchResultTasks.push(work);
            ChatRoomWork.chatRoomWorkRoomSyncTasks.push(work);
        }
        ChatRoomLeave();
        CommonSetScreen("Online", "ChatSearch");
        return this._state;
    }

    static readonly chatRoomWorkSearchQueryTasks: ChatRoomWorkTask[] = [];
    static readonly chatRoomWorkSearchResultTasks: ChatRoomWorkTask[] = [];
    static readonly chatRoomWorkRoomSyncTasks: ChatRoomWorkTask[] = [];

    static init(mod: ModSDKModAPI, lateHook: (callback: () => void) => void) {
        mod.hookFunction("ChatSearchQuery", 1, (args, next) => {
            while (this.chatRoomWorkSearchQueryTasks.length > 0) {
                this.chatRoomWorkSearchQueryTasks.shift()?.once_before_ChatSearchQuery?.();
            }
            next(args);
        });

        mod.hookFunction("ChatSearchResultResponse", 1, (args, next) => {
            next(args);
            ChatRoomPlayerCanJoin = true;
            while (this.chatRoomWorkSearchResultTasks.length > 0) {
                this.chatRoomWorkSearchResultTasks.shift()?.once_after_ChatSearchResultResponse();
            }
        });

        mod.hookFunction("ChatRoomSync", 1, (args, next) => {
            next(args);
            while (this.chatRoomWorkRoomSyncTasks.length > 0) {
                this.chatRoomWorkRoomSyncTasks.shift()?.once_after_ChatRoomSync?.();
            }
        });
    }
}