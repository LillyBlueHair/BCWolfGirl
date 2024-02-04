import { ActivityInfo } from "../../utils/ChatMessages";
import { InitDressSequence } from "../../Control/SequenceCtrl/DressSequence";
import { IActivityExtened } from "./IActivity";

export class InjectionExtend implements IActivityExtened {
    activity = "Inject";
    on(player: Character, sender: Character, info: ActivityInfo) {
        if (info.ActivityName === "Inject" && info.SourceCharacter.MemberNumber === player.MemberNumber) {
            const target = ChatRoomCharacter.find(c => c.MemberNumber === info.TargetCharacter.MemberNumber);
            if (!target) return;
            InitDressSequence(player, target);
        }
    }
}