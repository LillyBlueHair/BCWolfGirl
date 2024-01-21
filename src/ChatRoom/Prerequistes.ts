import { IsPlayerWolfGirl } from "../Control/WolfGirlCtrl";
import { DataManager } from "../Data";

export type Prerequisite = (player: Character, sender: Character | number) => boolean;

export const NotSelf: Prerequisite = (player: Character, sender: Character | number) =>
    (typeof sender !== "number" ? sender.MemberNumber : sender) !== player.MemberNumber;

export const IsModerator: Prerequisite = (player: Character, sender: Character | number) => {
    if (DataManager.permission.isModerator(player, sender)) return true;
    return false;
}

export const BasicPrerequisites: Prerequisite[] = [NotSelf, IsPlayerWolfGirl, IsModerator];
export const NotFullyDressed: Prerequisite[] = [NotSelf, IsModerator];