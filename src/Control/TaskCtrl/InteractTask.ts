import { TimedCounterTask } from ".";
import { ActivityInfo } from "../../utils/ChatMessages";

export class InteractTask extends TimedCounterTask {
    summary(): string {
        return `在${new Date(this.time_out).toUTCString()}之前，接受${this.expected}个人互动，成功后获得${this.bonus}点奖励`
    }
    private _interact_list: Set<number> = new Set();
    private _check_act: Set<string> | undefined;
    private _check_groups: Set<string> | undefined;

    constructor(time_limit: number, counter: number, bonus: number, check_act: string[] | undefined, check_groups: string[] | undefined) {
        super(time_limit, counter, bonus);
        this._check_act = check_act ? new Set(check_act) : undefined;
        this._check_groups = check_groups ? new Set(check_groups) : undefined;
    }

    onActivity(player: Character, sender: Character, activity: ActivityInfo): void {
        if (activity.SourceCharacter.MemberNumber === player.MemberNumber) return;
        if (this._check_act && !this._check_act.has(activity.ActivityName)) return;
        if (this._check_groups && !this._check_groups.has(activity.ActivityGroup)) return;
        this._interact_list.add(activity.SourceCharacter.MemberNumber);
        this.cur = this._interact_list.size;
    }
}