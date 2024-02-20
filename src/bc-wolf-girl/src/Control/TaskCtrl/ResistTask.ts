import { DataManager } from "../../Data";
import { TimedCounterTask } from "./TimedCounterTask";

export class ResistTask extends TimedCounterTask {
    summary(): string {
        return `在 ${new Date(this.time_out).toLocaleTimeString()} (${this.time_limit_rate}x任务基础时间) 之前，忍耐${this.expected}次高潮，成功后获得${this.bonus}点奖励`
    }
    constructor(readonly time_limit_rate: number, readonly counter: number, readonly bonus: number) {
        super(time_limit_rate, counter, bonus);
    }
    onResist(player: PlayerCharacter): void {
        this.cur++;
        DataManager.statistics.add_counter('Resisted', 1);
    }
}