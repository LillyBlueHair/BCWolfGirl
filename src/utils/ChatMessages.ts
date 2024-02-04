export interface ActivityInfo {
    SourceCharacter: { MemberNumber: number };
    TargetCharacter: { MemberNumber: number };
    ActivityGroup: string;
    ActivityName: string;
    Asset?: {
        AssetName: string;
        CraftName: string;
        GroupName: string;
    }
}

export function ActivityDeconstruct(dict: ChatMessageDictionary): ActivityInfo | undefined {
    let SourceCharacter, TargetCharacter, ActivityGroup, ActivityName, Asset;
    for (let v of dict) {
        if (v['TargetCharacter'] !== undefined) TargetCharacter = { MemberNumber: v['TargetCharacter'] };
        else if (v['SourceCharacter'] !== undefined) SourceCharacter = { MemberNumber: v['SourceCharacter'] };
        else if (v['ActivityName'] !== undefined) ActivityName = v['ActivityName'];
        else if (v.Tag === 'FocusAssetGroup') ActivityGroup = v['FocusGroupName'];
        else if (v.Tag === 'ActivityAsset') {
            Asset = {
                AssetName: v['AssetName'],
                CraftName: v['CraftName'],
                GroupName: v['GroupName']
            };
        }
    }
    if (SourceCharacter === undefined || TargetCharacter === undefined
        || ActivityGroup === undefined || ActivityName === undefined) return undefined;
    return { SourceCharacter, TargetCharacter, ActivityGroup, ActivityName, Asset };
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
    public readonly LocalInfo: (Content: string) => void;
    public readonly SendAction: (Content: string) => void;
    public readonly SendChat: (Content: string) => void;
    public readonly SendWhisper: (target: number, Content: string) => void;
    public readonly SendBeep: (target: number, Content: string) => void;

    constructor(readonly CUSTOM_ACTION_TAG: string) {
        const DictItem = (Content: string) => { return { Tag: `MISSING PLAYER DIALOG: ${CUSTOM_ACTION_TAG}`, Text: Content } };

        this.SendAction = (Content: string) => {
            if (!Content || !Player || !Player.MemberNumber) return;
            ServerSend("ChatRoomChat", {
                Content: CUSTOM_ACTION_TAG,
                Type: "Action",
                Dictionary: [DictItem(Content)]
            });
        }

        this.SendChat = (Content: string) => {
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

        this.LocalInfo = (Content: string) => {
            if (!Content || !Player || !Player.MemberNumber) return;
            ChatRoomMessage({
                Sender: Player.MemberNumber,
                Content: Content,
                Type: "LocalMessage",
            });
        }

        this.SendWhisper = (target: number, Content: string) => {
            if (!Content || !Player || !Player.MemberNumber) return;
            ServerSend("ChatRoomChat", {
                Content: Content,
                Type: "Whisper",
                Target: target
            });
        }

        this.SendBeep = (target: number, Content: string) => {
            if (!Content || !Player || !Player.MemberNumber) return;
            ServerSend("AccountBeep", {
                MemberNumber: target,
                Message: Content,
                BeepType: "",
                IsSecret: false
            });
        }
    }
}