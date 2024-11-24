import { DataManager } from "../../Data";
import { TimedCounterTask } from "./TimedCounterTask";
import { ActivityInfo } from "bc-utilities";

export class InteractTask extends TimedCounterTask {
    summary(): string {
        const time_report = `Before ${new Date(this.time_out).toLocaleTimeString()} (${this.time_limit_rate}xtask base time)`;
        const group_report = this._check_groups ? `at ${[...this._check_groups.values()].map(i => AssetGroupGet('Female3DCG', i)?.Description).filter(i => i !== undefined).join(", ")} ` : '';
        const act_report = this._check_act ? `of ${[...this._check_act.values()].map(i => ActivityDictionaryText(`Activity${i}`)).join(", ")} Interaction` : 'Interaction';

        return `${time_report}, accept ${this.expected} individual ${group_report}${act_report}, and get ${this.bonus} points reward after success`
    }
    private _interact_list: Set<number> = new Set();
    private _check_act: Set<ActivityName> | undefined;
    private _check_groups: Set<AssetGroupItemName> | undefined;

    constructor(readonly time_limit_rate: number, readonly counter: number, readonly bonus: number, check_act: ActivityName[] | undefined, check_groups: AssetGroupItemName[] | undefined) {
        super(time_limit_rate, counter, bonus);
        this._check_act = check_act ? new Set(check_act) : undefined;
        this._check_groups = check_groups ? new Set(check_groups) : undefined;
    }

    onActivity(player: PlayerCharacter, sender: Character, activity: ActivityInfo): void {
        if (activity.SourceCharacter === player.MemberNumber) return;
        if (activity.TargetCharacter !== player.MemberNumber) return;
        if (this._check_act && !this._check_act.has(activity.ActivityName as ActivityName)) return;
        if (this._check_groups && !this._check_groups.has(activity.ActivityGroup as AssetGroupItemName)) return;
        this._interact_list.add(activity.SourceCharacter);
        this.cur = this._interact_list.size;
        if (this._check_groups?.has('ItemBreast'))
            DataManager.statistics.add_counter('BreastPlayed', 1);
        else if (this._check_groups?.has('ItemVulva'))
            DataManager.statistics.add_counter('VulvaPlayed', 1);
        else if (this._check_act?.has('Slap'))
            DataManager.statistics.add_counter('Spanked', 1);
    }
}