import { TimedCounterTask } from "./TimedCounterTask";
import { ActivityInfo } from "bc-utilities";

export class InteractTask extends TimedCounterTask {
    summary(): string {
        const time_report = `在 ${new Date(this.time_out).toLocaleTimeString()} (${this.time_limit_rate}x任务基础时间) 之前`;
        const group_report = this._check_groups ? `在 ${[...this._check_groups.values()].map(i => AssetGroupGet('', i)?.Description).filter(i => i !== undefined).join("、")} ` : '';
        const act_report = this._check_act ? `的 ${[...this._check_act.values()].map(i => ActivityDictionaryText(`Activity${i}`)).join("、")} 的互动` : '的互动';

        return `${time_report}，接受${this.expected}个人${group_report}${act_report}，成功后获得${this.bonus}点奖励`
    }
    private _interact_list: Set<number> = new Set();
    private _check_act: Set<string> | undefined;
    private _check_groups: Set<string> | undefined;

    constructor(time_limit_rate: number, counter: number, bonus: number, check_act: string[] | undefined, check_groups: string[] | undefined) {
        super(time_limit_rate, counter, bonus);
        this._check_act = check_act ? new Set(check_act) : undefined;
        this._check_groups = check_groups ? new Set(check_groups) : undefined;
    }

    onActivity(player: PlayerCharacter, sender: Character, activity: ActivityInfo): void {
        if (activity.SourceCharacter.MemberNumber === player.MemberNumber) return;
        if (activity.TargetCharacter.MemberNumber !== player.MemberNumber) return;
        if (this._check_act && !this._check_act.has(activity.ActivityName)) return;
        if (this._check_groups && !this._check_groups.has(activity.ActivityGroup)) return;
        this._interact_list.add(activity.SourceCharacter.MemberNumber);
        this.cur = this._interact_list.size;
    }
}