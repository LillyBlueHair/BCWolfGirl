import { TimedCounterTask } from "./TimedCounterTask";
import { ActivityInfo } from "../../utils/ChatMessages";

export class BegOrgasmTask extends TimedCounterTask {
    summary(): string {
        return `在 ${new Date(this.time_out).toLocaleTimeString()} (${this.time_limit_rate}x任务基础时间) 之前，向${this.expected}个人乞求高潮，成功后获得${this.bonus}点奖励`
    }
    constructor(time_limit: number, counter: number, bonus: number) {
        super(time_limit, counter, bonus);
    }

    last_interact_num: number = 0;
    interact_list: Set<number> = new Set();
    onActivity(player: Character, sender: Character, activity: ActivityInfo): void {
        if (activity.SourceCharacter.MemberNumber === player.MemberNumber) return;
        if (activity.TargetCharacter.MemberNumber !== player.MemberNumber) return;
        this.last_interact_num = sender.MemberNumber;
    }

    onOrgasm(player: Character): void {
        this.interact_list.add(this.last_interact_num);
        this.cur = this.interact_list.size;
    }
}