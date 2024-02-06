import { ActivityInfo } from "../../utils/ChatMessages";
import { InitDressSequence } from "../../Control/SequenceCtrl/DressSequence";
import { ActivityTriggerMode, IActivityExtened } from "./IActivity";
import { InjectionType } from "../../Control/Injection/IInjection";
import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DoInjection } from "../../Control/SequenceCtrl/InjectionSequence";
import { IsPlayerWolfGirl } from "../../Control/WolfGirlCtrl";

export class InjectionExtend implements IActivityExtened {
    activity = "Inject";
    mode: ActivityTriggerMode = "selfonother";
    onBodyparts = undefined;
    on(player: Character, sender: Character, info: ActivityInfo) {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === info.TargetCharacter.MemberNumber);
        if (!target) return;
        if (this.type === undefined)
            InitDressSequence(player, target);
    }

    type: InjectionType | undefined = undefined;

    static _instance: InjectionExtend;
    static get global() {
        if (!this._instance) this._instance = new InjectionExtend();
        return this._instance;
    }

    static setType(type: InjectionType | undefined) {
        this.global.type = type;
    }

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

export class InjectionExtendInjected implements IActivityExtened {
    activity = "Inject";
    mode: ActivityTriggerMode = "onself";
    onBodyparts = undefined;
    on(player: Character, sender: Character, info: ActivityInfo) {
        const v = info.BCDictionary.find(i => i.Tag === "WolfGirlInjectType");
        if (v && IsPlayerWolfGirl(player)) {
            DoInjection(v.Text as InjectionType, true);
        }
    }
}