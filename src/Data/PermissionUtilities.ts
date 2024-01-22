import { EILNetwork } from "../Network";
import { ExtractMemberNumber } from "../utils/Character";
import { DataManager } from ".";

export class PermissionUtilities {
    parent: DataManager;
    constructor(parent: DataManager) {
        this.parent = parent;
    }

    setLoverMode(arg: boolean) {
        this.parent.data.permission.loverModerators = arg;
        this.parent.save();
    }

    setModerator(id: number, add: boolean) {
        if (add) {
            if (!this.parent.data.permission.moderators.includes(id)) {
                this.parent.data.permission.moderators.push(id);
            }
        } else {
            const index = this.parent.data.permission.moderators.indexOf(id);
            if (index !== -1) {
                this.parent.data.permission.moderators.splice(index, 1);
            }
        }
        this.parent.save();
    }

    get data() {
        return this.parent.data.permission;
    }

    isModerator(player: Character, other: number | Character): boolean {
        const num = ExtractMemberNumber(other);
        if (EILNetwork.Access.isEIL(num)) return true;
        if (player.Ownership && player.Ownership.MemberNumber === num) return true;
        if (this.parent.data.permission.moderators.includes(num)) return true;
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
