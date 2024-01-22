import { EILNetwork } from "../Network";
import { ExtractMemberNumber } from "../utils/Character";
import { DataManager } from ".";

export class PermissionUtilities {
    parent: DataManager;

    moderators: Set<number>;

    constructor(parent: DataManager) {
        this.parent = parent;
        this.moderators = new Set<number>(this.parent.data.permission.moderators);
    }

    setLoverMode(arg: boolean) {
        this.parent.data.permission.loverModerators = arg;
        this.parent.save();
    }

    setModerator(id: number, add: boolean) {
        if (add) {
            if (!this.moderators.has(id)) {
                this.moderators.add(id);
                this.parent.data.permission.moderators.push(id);
                this.parent.save();
            }
        } else {
            if (this.moderators.has(id)) {
                this.moderators.delete(id);
                this.parent.data.permission.moderators = Array.from(this.moderators);
                this.parent.save();
            }
        }
    }

    get data() {
        return this.parent.data.permission;
    }

    isModerator(player: Character, other: number | Character): boolean {
        const num = ExtractMemberNumber(other);
        if (EILNetwork.Access.isEIL(num)) return true;
        if (player.Ownership && player.Ownership.MemberNumber === num) return true;
        if (this.moderators.has(num)) return true;
        if (this.parent.data.permission.loverModerators
            && player.Lovership && player.Lovership.some(i => i.MemberNumber === num)) return true;
        return false;
    }

    canModerate(player: Character, other: Character): boolean {
        if (!player.MemberNumber) return false;
        if (EILNetwork.Access.isEIL(player.MemberNumber)) return true;
        if (other.Ownership && other.Ownership.MemberNumber === player.MemberNumber) return true;
        if (other.Lovership && other.Lovership.some(i => i.MemberNumber === player.MemberNumber)) return true;
        return false;
    }
}
