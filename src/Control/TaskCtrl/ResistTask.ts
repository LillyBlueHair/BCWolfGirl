import { TimedCounterTask } from ".";

export class ResistTask extends TimedCounterTask {
    summary(): string {
        return `在${new Date(this.time_out).toLocaleTimeString()}之前，忍耐${this.expected}次高潮，成功后获得${this.bonus}点奖励`
    }
    constructor(time_limit: number, counter: number, bonus: number) {
        super(time_limit, counter, bonus);
    }
    onResist(player: Character): void {
        this.cur++;
    }
}