import { EILNetwork } from "../Network";
import { ExtractMemberNumber } from "../utils/Character";
import { DataManager } from "./DataManager";

export class PermissionUtilities {
    moderators: Set<number>;
    constructor(readonly parent: DataManager) {
        this.moderators = new Set<number>(this.parent.data.permission.moderators);
    }

    private save() {
        this.parent.save("permission");
    }

    setLoverMode(arg: boolean) {
        this.parent.data.permission.loverModerators = arg;
        this.save();
    }

    setModerator(id: number, add: boolean) {
        if (add) {
            if (!this.moderators.has(id)) {
                this.moderators.add(id);
                this.parent.data.permission.moderators.push(id);
                this.save();
            }
        } else {
            if (this.moderators.has(id)) {
                this.moderators.delete(id);
                this.parent.data.permission.moderators = Array.from(this.moderators);
                this.save();
            }
        }
    }

    get data() {
        return this.parent.data.permission;
    }

    isCommandAuthorized(moderatee: Character, moderator: number | Character): boolean {
        const num = ExtractMemberNumber(moderator);
        if (this.isEILNet(moderator)) return true;
        if (this.isOwner(moderator, moderatee)) return true;
        if (this.isAdditionModerator(num)) return true;
        if (this.parent.data.permission.loverModerators
            && this.isLover(moderator, moderatee)) return true;
        return false;
    }

    isEILNet(moderator: number | Character): boolean {
        const num = ExtractMemberNumber(moderator);
        return EILNetwork.Access.isEIL(num);
    }

    isLover(moderator: number | Character, moderatee: Character): boolean {
        const num = ExtractMemberNumber(moderator);
        if (moderatee.Lovership && moderatee.Lovership.some(i => i.MemberNumber === num)) return true;
        return false;
    }

    isOwner(moderator: number | Character, moderatee: Character): boolean {
        const num = ExtractMemberNumber(moderator);
        if (moderatee.Ownership && moderatee.Ownership.MemberNumber === num) return true;
        return false;
    }

    isAdditionModerator(moderator: number | Character): boolean {
        const num = ExtractMemberNumber(moderator);
        return this.moderators.has(num);
    }
}
