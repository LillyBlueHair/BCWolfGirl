export interface ActivityInfo {
    SourceCharacter: { MemberNumber: number };
    TargetCharacter: { MemberNumber: number };
    ActivityGroup: string;
    ActivityName: string;
}

export function ActivityDeconstruct(dict: ChatMessageDictionary): ActivityInfo | undefined {
    let SourceCharacter, TargetCharacter, ActivityGroup, ActivityName;
    for (let v of dict) {
        if (v.hasOwnProperty('TargetCharacter')) {
            TargetCharacter = { MemberNumber: v['TargetCharacter'] };
        } else if (v.hasOwnProperty('SourceCharacter')) {
            SourceCharacter = { MemberNumber: v['SourceCharacter'] };
        } else if (v.hasOwnProperty('ActivityName')) {
            ActivityName = v['ActivityName'];
        } else if (v.hasOwnProperty('Tag') && v.Tag === 'FocusAssetGroup') {
            ActivityGroup = v['FocusGroupName'];
        }
    }
    if (SourceCharacter === undefined || TargetCharacter === undefined
        || ActivityGroup === undefined || ActivityName === undefined) return undefined;
    return { SourceCharacter, TargetCharacter, ActivityGroup, ActivityName };
}

export function ChatRoomChatMessage(msg: string) {
    if (!msg) return;
    ServerSend("ChatRoomChat", { Content: msg, Type: "Chat" });
}

export class ChatRoomAction {
    private static _instance: ChatRoomAction | undefined = undefined;

    static get instance(): ChatRoomAction {
        return ChatRoomAction._instance as ChatRoomAction;
    }

    static init(tag: string) {
        if (ChatRoomAction._instance) return;
        ChatRoomAction._instance = new ChatRoomAction(tag);
    }

    public readonly LocalAction: (Content: string) => void;
    public readonly ServerAction: (Content: string) => void;
    public readonly ServerChat: (Content: string) => void;

    constructor(readonly CUSTOM_ACTION_TAG: string) {
        const DictItem = (Content: string) => { return { Tag: `MISSING PLAYER DIALOG: ${CUSTOM_ACTION_TAG}`, Text: Content } };

        this.ServerAction = (Content: string) => {
            if (!Content || !Player || !Player.MemberNumber) return;
            ServerSend("ChatRoomChat", {
                Content: CUSTOM_ACTION_TAG,
                Type: "Action",
                Dictionary: [DictItem(Content)]
            });
        }

        this.ServerChat = (Content: string) => {
            if (!Content || !Player || !Player.MemberNumber) return;
            ServerSend("ChatRoomChat", {
                Content: Content,
                Type: "Chat"
            });
        }

        this.LocalAction = (Content: string) => {
            if (!Content || !Player || !Player.MemberNumber) return;
            ChatRoomMessage({
                Sender: Player.MemberNumber,
                Content: CUSTOM_ACTION_TAG,
                Type: "Action",
                Dictionary: [DictItem(Content)],
            });
        }
    }
}