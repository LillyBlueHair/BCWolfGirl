declare var TranslationLanguage: string;
declare var CurrentScreen: string;
declare var ChatRoomSpace: string | null;

type AssetGroupItemName =
    'ItemAddon' | 'ItemArms' | 'ItemBoots' | 'ItemBreast' | 'ItemButt' |
    'ItemDevices' | 'ItemEars' | 'ItemFeet' | 'ItemHands' | 'ItemHead' |
    'ItemHood' | 'ItemLegs' | 'ItemMisc' | 'ItemMouth' | 'ItemMouth2' |
    'ItemMouth3' | 'ItemNeck' | 'ItemNeckAccessories' | 'ItemNeckRestraints' |
    'ItemNipples' | 'ItemNipplesPiercings' | 'ItemNose' | 'ItemPelvis' |
    'ItemTorso' | 'ItemTorso2' | 'ItemVulva' | 'ItemVulvaPiercings' |
    'ItemHandheld'
    ;

interface ChatRoomChatLogItem {
    Chat: string;
    Garbled: string;
    Original: string;
    SenderName: string;
    SenderMemberNumber: number;
    Time: number;
}

type ServerChatRoomData = {
    Name: string;
    Description: string;
    Admin: number[];
    Ban: number[];
    Background: string;
    /* FIXME: server actually expects a string there, but we cheat to make the typing simpler */
    Limit: number;
    Game: ServerChatRoomGame;
    Locked: boolean;
    Private: boolean;
    BlockCategory: ServerChatRoomBlockCategory[];
    Language: ServerChatRoomLanguage;
    Space: ServerChatRoomSpace;
    MapData?: ServerChatRoomMapData;
    Custom: {
        ImageURL?: string;
        ImageFilter?: string;
        MusicURL?: string;
    };
    Character: ServerAccountDataSynced[];
}

type ServerChatRoomSettings = Partial<ServerChatRoomData> & {
    Character?: never;
}

declare var ChatRoomChatLog: ChatRoomChatLogItem[] | undefined | null;

interface Lovership {
    Name: string;
    MemberNumber: number;
    Stage: 0 | 1 | 2;
    Start: number;
}

interface Character {
    ID: number;
    Appearance: Item[];
    AllowItem: boolean;
    AssetFamily: string;
    MemberNumber: number;
    GhostList?: number[];
    BlackList?: number[];
    FriendList?: number[];
    Name: string;
    Nickname: string;
    ActivePose: string[] | null;
    Effect: string[];
    Money?: number;
    Skill?: { Type: string, Level: number, Progress: number, Ratio?: number }[];
    FriendNames?: Map<number, string>;
    CanInteract: () => boolean;
    CanWalk: () => boolean;
    CanTalk: () => boolean;
    CanChangeToPose: (string) => boolean;
    IsOwnedByMemberNumber: (id: number) => boolean;
    IsLoverOfMemberNumber: (id: number) => boolean;
    FocusGroup: AssetGroup | null;
    Ownership?: {
        MemberNumber?: number,
        Name: string,
        Start: number,
        Stage: number,
    },
    Lovership?: Lovership[],
    OnlineSharedSettings: {
        AllowFullWardrobeAccess: boolean,
        BlockBodyCosplay: boolean,
        AllowPlayerLeashing: boolean,
        DisablePickingLocksOnSelf: boolean,
        GameVersion: string,
        ItemsAffectExpressions: boolean,
    };
    OnlineSettings?: {
        AutoBanBlackList: boolean;
        AutoBanGhostList: boolean;
        DisableAnimations: boolean;
        SearchShowsFullRooms: boolean;
        SearchFriendsFirst: boolean;
        SendStatus?: boolean;
        ShowStatus?: boolean;
        EnableAfkTimer: boolean;
    };
    ExtensionSettings: { [k: string]: any };
    ImmersionSettings?: {
        BlockGaggedOOC: boolean;
        StimulationEvents: boolean;
        ReturnToChatRoom: boolean;
        ReturnToChatRoomAdmin: boolean;
        SenseDepMessages: boolean;
        ChatRoomMuffle: boolean;
        BlindAdjacent: boolean;
        AllowTints: boolean;
    };
    ArousalSettings: {
        Active: string;
        Visible: string;
        ShowOtherMeter: boolean;
        AffectExpression: boolean;
        AffectStutter: string;
        VFX: string;
        VFXVibrator: string;
        VFXFilter: string;
        Progress: number;
        ProgressTimer: number;
        VibratorLevel: number;
        ChangeTime: number;
        OrgasmTimer?: number;
        OrgasmStage?: number;
        OrgasmCount?: number;
        DisableAdvancedVibes: boolean;
        Activity: { Name: string, Self: number, Other: number }[],
        Zone: { Name: string, Factor: number, Orgasm?: boolean }[],
    };
    LastChatRoom: ServerChatRoomSettings;
    Reputation?: { Type: string, Value: number }[];
}

type Color = string | string[];

declare const LZString: import("lz-string").LZStringStatic;

interface AssetGroup {
    Family: string,
    Name: string,
    Description: string,
    BodyCosplay: boolean,
    Category: 'Apperance' | 'Item' | 'Script',
    DrawingPriority: number,
    Clothing: boolean
}

interface Asset {
    Name: string;
    Description: string;
    AllowLock: boolean;
    Archetype: string;
    Group: AssetGroup;
    Extended?: boolean;
}

interface TypeRecord {
    [k: string]: number
}

interface ItemProperty {
    AllowActivity?: string[];
    Attribute?: string[];
    Block?: string[];
    Difficulty?: number;
    Effect?: string[];
    Hide?: string[];
    HideItem?: string[];

    TypeRecord?: TypeRecord;

    Expression?: string | null;
    InsertedBeads?: number;
    OverrideAssetEffect?: boolean;
    LockedBy?: string;
    LockMemberNumber?: number;
    Mode?: string;
    SetPose?: string[];
    FreezeActivePose?: string[];
    SelfUnlock?: boolean;
    AutoPunish?: number;
    AutoPunishUndoTime?: number;
    AutoPunishUndoTimeSetting?: number;
    OriginalSetting?: number;
    PunishStruggle?: boolean;
    ChatMessage?: boolean;
    BlinkState?: boolean;
    Text?: string;
    BlockRemotes?: boolean;
    OpenPermission?: boolean;
    OpenPermissionArm?: boolean;
    OpenPermissionChastity?: boolean;
    OpenPermissionLeg?: boolean;
    Intensity?: number;
    OverridePriority?: number | { [key: string]: number; }
}

interface CraftingItem {
    Item: string;
    Name: string;
    Description: string;
    MemberName?: string;
    MemberNumber?: number;
    Property: string,
    Color: string,
    Lock: string | "",
    Private: boolean,
    Type?: string | null;
    OverridePriority?: null | number,
    ItemProperty?: ItemProperty
}

interface Item {
    Asset: Asset;
    Color?: Color;
    Craft?: CraftingItem;
    Difficulty?: number;
    Property?: ItemProperty;
}

interface ServerBeepData {
    MemberNumber?: number,
    MemberName?: string,
    ChatRoomName?: string,
    Message?: string,
    Private?: boolean
}

declare var Player: Character | undefined;
declare var ChatRoomCharacter: Character[];
declare var ChatRoomPlayerCanJoin: boolean;

declare var KidnapLeagueOnlineBountyTarget: number;
declare var KidnapLeagueOnlineBountyTargetStartedTime: number;

declare function LoginMaidItems(): void;
declare function LoginMaidItems(): void;

declare function InventoryIsWorn(C: Character, AssetName: string, AssetGroup: string): boolean;
declare function InventoryLock(C: Character, Item: Item, Lock: string, MemberNumber: number, Update: boolean = true)
declare function InventoryShockExpression(C: Character): void;
declare function InventoryGet(Character: Character, BodyPart: String): Item | null;

declare function ExtendedItemSetOptionByRecord(C: Character, itemOrGroupName: Item | string, typeRecord?: TypeRecord, option?: { push?: boolean, C_Source?: Character, refresh?: boolean, properties?: ItemProperty }): void;

declare function ServerSend(Message: string, Data: any): void;
declare function CommonTime(): number;
declare function ChatRoomSendLocal(Content: string, Timeout?: number): void;
declare function SpeechGetTotalGagLevel(C: Character, NoDeaf?: boolean): number;

declare function LogQuery(QueryLogName: string, QueryLogGroup: string): boolean;
declare function LogAdd(NewLogName: string, NewLogGroup: string, NewLogValue?: number, Push?: boolean): void;

type MessageActionType = "Action" | "Chat" | "Whisper" | "Emote" | "Activity" | "Hidden" |
    "LocalMessage" | "ServerMessage" | "Status";

declare function CharacterAppearanceSetColorForGroup(Character: Character, Color: Color, BodyPart: String): void;
declare function CharacterItemsHavePoseAvailable(C: Character, Type: string | undefined, Pose: string): boolean;
declare function CharacterCanChangeToPose(C: Character, poseName: string): boolean;
declare function CharacterRefresh(C: Character, Push?: boolean, RefreshDialog?: boolean): void;
declare function CharacterNickname(C: Character): string;
declare function CharacterLoadCanvas(C: Character): void;
declare function CharacterChangeMoney(C: Character, Value: number): void;
declare function CharacterSetActivePose(C: Character, NewPose: string): void;

declare function ServerPlayerAppearanceSync(): void;
declare function ServerPlayerInventorySync(): void;
declare function ServerPlayerReputationSync(): void;
declare function ServerPlayerSync(): void;
declare function ServerPlayerSkillSync(): void;
declare function ServerPlayerExtensionSettingsSync(dataKeyName: string): void;

declare function ChatRoomCharacterItemUpdate(Character: Character, Group: string): void;
declare function ChatRoomCharacterUpdate(Character: Character): void;
declare function AssetGet(Family: string, Group: string, Name: string): Asset | null;
declare function AssetGroupGet(Family: string, Group: string): AssetGroup | null;

interface Activity {
    Name: ActivityName;
    MaxProgress: number;
    MaxProgressSelf?: number;
    Prerequisite: ActivityPrerequisite[];
    Target: AssetGroupItemName[];
    TargetSelf?: AssetGroupItemName[] | true;
    Reverse?: true;
    MakeSound?: boolean;
    StimulationAction?: StimulationAction;
    ActivityExpression?: ExpressionTrigger[];
}

declare function AssetAllActivities(family: string): Activity[];
declare function ActivityAllowedForGroup(character: Character, groupname: AssetGroupItemName, allowItem: boolean = false): Activity[];
declare var ActivityFemale3DCG: Activity[] | null;
declare var ActivityFemale3DCGOrdering: string[];


declare var KeyPress: number;
declare var MiniGameCheatAvailable: boolean;

declare var MainCanvas: CanvasRenderingContext2D;

declare var ServerAccountUpdate: {
    SyncToServer(): void;
    QueueData(Data: object, Force?: true): void
};

declare var MagicPuzzleStarted: boolean;
declare var MiniGameEnded: boolean;
declare var MiniGameVictory: boolean;
declare var MagicPuzzleFinish: number;
declare var ActivityOrgasmRuined: boolean;

type MessageContentType = string;

type CommonChatTags =
    | "SourceCharacter"
    | "DestinationCharacter"
    | "DestinationCharacterName"
    | "TargetCharacter"
    | "TargetCharacterName"
    | "AssetName";

interface ChatMessageDictionaryEntry {
    [k: string]: any;
    Tag?: CommonChatTags | string;
    Text?: string;
    MemberNumber?: number;
}

type ChatMessageDictionary = ChatMessageDictionaryEntry[];

interface ServerChatRoomMessageBase {
    Sender?: number;
}

type ServerChatRoomMessageType = "Action" | "Chat" | "Whisper" | "Emote" | "Activity" | "Hidden" |
    "LocalMessage" | "ServerMessage" | "Status";

interface ServerChatRoomMessage extends ServerChatRoomMessageBase {
    Target?: number;
    Content: string;
    Type: ServerChatRoomMessageType;
    Dictionary?: ChatMessageDictionary;
    Timeout?: number;
}

declare function ExtendedItemInit(C: Character, I: Item, Push: boolean = true, Refresh: boolean = true): boolean;


// ChatRoom
interface ChatRoomMessageHandler {
    Description?: string;
    Priority: number;
    Callback: (data: ServerChatRoomMessage, sender: Character, msg: string, metadata?: IChatRoomMessageMetadata)
        => boolean | { msg?: string; skip?: (handler: ChatRoomMessageHandler) => boolean };
}

declare function ChatRoomRegisterMessageHandler(handler: ChatRoomMessageHandler): void;
declare function ChatRoomMessage(data: ServerChatRoomMessage): void;
declare function ChatRoomPublishCustomAction(msg: string, LeaveDialog: boolean, Dictionary: ChatMessageDictionary)
declare var ChatRoomMapVisible: boolean;
declare function ChatRoomMapCharacterIsHearable(C: Character): boolean;
declare function ChatRoomLeave(): void;

declare function PreferenceIsPlayerInSensDep(bypassblindness?: boolean): boolean;
declare var InformationSheetPreviousModule: string;
declare var InformationSheetPreviousScreen: string;

declare function ChatRoomSendChat(): void;
declare var ChatRoomMenuButtons: string[];
declare function ElementValue(id: string, value?: string): string;

declare var CurrentCharacter: Character | null;

interface ServerChatRoomSearchData {
    Name: string;
    Language: string;
    Creator: string;
    CreatorMemberNumber: number;
    MemberCount: number;
    MemberLimit: number;
    Description: string;
    BlockCategory: string[];
    Game: ServerChatRoomGame;
    Friends: ServerFriendInfo[];
    Space: ServerChatRoomSpace;
    MapType?: string;
}

declare var ChatSearchResult: (ServerChatRoomSearchData & { DisplayName: string, Order: number })[];
declare var ChatRoomData: ServerChatRoomData;


//text.js
declare function TextGet(key: string): string;

//Common.js
declare function CommonSetScreen(Module: string, Screen: string): void;

//Dialog.js
declare function DialogMenuButtonBuild(C: Character): void;
declare function DialogInventoryAdd(C: Character, Item: Item, boolean: isWorn): void;
declare function DialogInventorySort();
declare var DialogMenuButton: string[]
declare var DialogFocusItem: Item | null;

//Female3DCG.js
interface Pose {
    Name: string;
    Category?: 'BodyUpper' | 'BodyLower' | 'BodyFull';
    AllowMenu?: true;
    OverrideHeight?: AssetOverrideHeight;
    Hide?: string[];
    MovePosition?: { Group: string; X: number; Y: number; }[];
}
declare var PoseFemale3DCG: Pose[];


declare var AssetFemale3DCG: ({ Priority: number; Category?: 'Appearance' | 'Item'; Group: string; Clothing: boolean; BodyCosplay?: boolean; })[]
declare var AssetFemale3DCGExtended: ({ [k: string]: { [k: string]: any } });
type ExtendedArchetype = 'modular' | 'typed' | 'vibrating' | 'variableheight';

declare function InventoryAdd(C: Character, item: string, group: string, Push?: boolean = true);
declare function DialogCanUseCraftedItem(C: Character, craft: CraftingItem): boolean;


// Cafe.js
declare var CafeIsHeadMaid: boolean;

// MaidQuarters.js
declare var MaidQuartersItemClothPrev: any;

//suitcase
declare var KidnapLeagueOnlineBountyTarget: number;
declare var KidnapLeagueOnlineBountyTargetStartedTime: number;

//ChatRoom.js
declare var ChatRoomTargetMemberNumber: number | null;
declare var ChatRoomSlowStop: boolean;
declare function ChatRoomMessageMentionsCharacter(C: Character, msg: string): boolean;
declare function ChatRoomNotificationRaiseChatMessage(C: Character, msg: string): void;
declare function ChatRoomHTMLEntities(msg: string): string;

//Speech.js
declare function SpeechGarble(C: Character, CD: string, NoDeaf?: boolean): string;

//Reputation.js
declare function ReputationGet(RepType: string): number;
declare function ReputationProgress(RepType: string, Value: number): void;

// skill.js
declare function SkillProgress(SkillType: string, SkillProgress: number): void;
declare function SkillSetRatio(SkillType: string, Ratio: number, Push: boolean = true): void;
declare function SkillGetRatio(SkillType: string): number;

// vibrator.js
declare var VibratorModeOptions: { Standard: { Name: string, Property: any }[], Advanced: { Name: string, Property: any }[] };