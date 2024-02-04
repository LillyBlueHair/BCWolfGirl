import { ActivityInfo } from "../../utils/ChatMessages";
import { InitDressSequence } from "../../Control/SequenceCtrl/DressSequence";
import { ActivityTriggerMode, IActivityExtened } from "./IActivity";

export class InjectionExtend implements IActivityExtened {
    activity = "Inject";
    mode: ActivityTriggerMode = "selfonother";
    onBodyparts = undefined;
    on(player: Character, sender: Character, info: ActivityInfo) {
        const target = ChatRoomCharacter.find(c => c.MemberNumber === info.TargetCharacter.MemberNumber);
        if (!target) return;
        InitDressSequence(player, target);
    }
}