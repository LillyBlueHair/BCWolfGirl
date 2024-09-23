import { DataManager } from "../../Data";
import { TimedCounterTask } from "./TimedCounterTask";
import { ActivityInfo } from "bc-utilities";

export class BegOrgasmTask extends TimedCounterTask {
    summary(): string {
        return `在 ${new Date(this.time_out).toLocaleTimeString()} (${this.time_limit_rate}x任务基础时间) 之前，向${this.expected}个人乞求高潮，成功后获得${this.bonus}点奖励`
    }
    constructor(readonly time_limit: number, readonly counter: number, readonly bonus: number) {
        super(time_limit, counter, bonus);
    }

    last_interact_num: number = 0;
    interact_list: Set<number> = new Set();
    onActivity(player: PlayerCharacter, sender: Character, activity: ActivityInfo): void {
        if (activity.SourceCharacter === player.MemberNumber) return;
        if (activity.TargetCharacter !== player.MemberNumber) return;
        this.last_interact_num = sender.MemberNumber ?? -1;
    }

    onOrgasm(player: PlayerCharacter): void {
        this.interact_list.add(this.last_interact_num);
        this.cur = this.interact_list.size;
        DataManager.statistics.add_counter('Orgasmed', 1);
    }
}