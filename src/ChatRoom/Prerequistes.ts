import { IsPlayerWolfGirl } from "../Control/WolfGirlCtrl";
import { IsCollarOn } from "../Control/WolfGirlCtrl/Check";
import { DataManager } from "../Data";

export type Prerequisite = (player: Character, sender: Character | number) => boolean;

export const IsSelf: Prerequisite = (player: Character, sender: Character | number) =>
    (typeof sender !== "number" ? sender.MemberNumber : sender) === player.MemberNumber;

export const IsModerator: Prerequisite = (player: Character, sender: Character | number) => {
    if (DataManager.permission.isModerator(player, sender)) return true;
    return false;
}

export const Or = (...prerequisites: Prerequisite[]): Prerequisite => {
    return (player: Character, sender: Character | number) => {
        return prerequisites.some(p => p(player, sender));
    }
}

export const And = (...prerequisites: Prerequisite[]): Prerequisite => {
    return (player: Character, sender: Character | number) => {
        return prerequisites.every(p => p(player, sender));
    }
}

export const Not = (prerequisite: Prerequisite): Prerequisite => {
    return (player: Character, sender: Character | number) => {
        return !prerequisite(player, sender);
    }
}

export const BasicPrerequisites: Prerequisite = And(Not(IsSelf), IsPlayerWolfGirl, IsModerator);
export const OutfitFixPrerequisites: Prerequisite = And(Not(IsSelf), IsModerator);
export const SelfPrerequisites: Prerequisite = And(IsSelf, IsPlayerWolfGirl);
export const ModOrSelfPrerequisites: Prerequisite = And(Or(IsSelf, IsModerator), IsPlayerWolfGirl);