import { DataManager } from "../Data";

export type Prerequisite = (player: Character, sender: Character | number) => boolean;

export const NotSelf: Prerequisite = (player: Character, sender: Character | number) =>
    (typeof sender !== "number" ? sender.MemberNumber : sender) !== player.MemberNumber;

export const IsModerator: Prerequisite = (player: Character, sender: Character | number) => {
    if (DataManager.permission.isModerator(player, sender)) return true;
    return false;
}

export const BasicPrerequisites: Prerequisite[] = [NotSelf, IsModerator];