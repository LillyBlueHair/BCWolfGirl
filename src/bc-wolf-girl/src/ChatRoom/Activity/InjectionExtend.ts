import { ActivityInfo, ActivityTriggerMode, IActivityExtended } from "bc-utilities";
import { InitDressSequence } from "../../Control/SequenceCtrl/DressSequence";
import { InjectionType } from "../../Control/Injection/IInjection";
import { DoInjection } from "../../Control/SequenceCtrl/InjectionSequence";
import { IsPlayerWolfGirl } from "../../Control/WolfGirlCtrl";
import { ToolsInjector, ToolsVisor } from "../../Control/OutfitCtrl";
import { DefaultCheckItems } from "../../Control/OutfitCtrl/Utils";

export class InjectingExtend extends IActivityExtended<CustomActivities, CustomPrerequisites> {
    constructor() { super("selfonother", undefined, "Inject"); }

    on(player: PlayerCharacter, sender: Character, info: ActivityInfo) {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === info.TargetCharacter.MemberNumber);
        if (!target) return;
        if (!DefaultCheckItems(player, [ToolsVisor, ToolsInjector], false)) return;
        if (this.type === undefined)
            InitDressSequence(player, target);
    }

    public type: InjectionType | undefined = undefined;

    adjustDict(Content: string, dict: any[]): any[] {
        if (this.type) {
            dict.push({
                Tag: "WolfGirlInjectType",
                Text: this.type
            });
        }
        return dict;
    }
}

export class InjectedExtend extends IActivityExtended<CustomActivities, CustomPrerequisites> {
    constructor() { super("onself", undefined, "Inject"); }

    on(player: PlayerCharacter, sender: Character, info: ActivityInfo) {
        const v = info.BCDictionary.find(i => i.Tag === "WolfGirlInjectType");
        if (v && IsPlayerWolfGirl(player)) {
            DoInjection(v.Text as InjectionType, true);
        }
    }
}