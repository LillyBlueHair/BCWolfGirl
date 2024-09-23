import { ActivityInfo, ActivityTriggerMode, IActivityExtended } from "bc-utilities";
import { InitDressSequence } from "../../Control/SequenceCtrl/DressSequence";
import { InjectionType } from "../../Control/Injection/IInjection";
import { DoInjection } from "../../Control/SequenceCtrl/InjectionSequence";
import { IsPlayerWolfGirl } from "../../Control/WolfGirlCtrl";
import { ToolsInjector, ToolsVisor } from "../../Control/OutfitCtrl";
import { DefaultCheckItems } from "../../Control/OutfitCtrl/Utils";

interface InjectDictEntry extends TextDictionaryEntry {
    Tag: 'WolfGirlInjectType';
    Text: InjectionType;
}

function isInjectDictEntry(entry: ChatMessageDictionaryEntry): entry is InjectDictEntry {
    return (entry as Partial<TextDictionaryEntry>).Tag === 'WolfGirlInjectType';
}

export class InjectingExtend extends IActivityExtended<CustomActivities, CustomPrerequisites> {
    constructor() { super("selfonother", undefined, "Inject"); }

    on(player: PlayerCharacter, sender: Character, info: ActivityInfo) {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === info.TargetCharacter);
        if (!target) return;
        if (!DefaultCheckItems(player, [ToolsVisor, ToolsInjector], false)) return;
        if (this.type === undefined)
            InitDressSequence(player, target);
    }

    public type: InjectionType | undefined = undefined;

    adjustDict(Content: string, dict: ChatMessageDictionary): ChatMessageDictionary {
        if (this.type) {
            dict.push({
                Tag: "WolfGirlInjectType",
                Text: this.type
            } as InjectDictEntry);
        }
        return dict;
    }
}

export class InjectedExtend extends IActivityExtended<CustomActivities, CustomPrerequisites> {
    constructor() { super("onself", undefined, "Inject"); }

    on(player: PlayerCharacter, sender: Character, info: ActivityInfo) {
        const v = info.BCDictionary.find(i => isInjectDictEntry(i));
        if (v && IsPlayerWolfGirl(player)) {
            DoInjection(v.Text as InjectionType, true);
        }
    }
}