import { DataManager } from "../../Data";
import { TimedCounterTask } from "./TimedCounterTask";

export class ResistTask extends TimedCounterTask {
    summary(): string {
        return `Before ${new Date(this.time_out).toLocaleTimeString()} (${this.time_limit_rate}x task base time), endure ${this.expected} climaxes, and get ${this.bonus} points of reward if successful`
    }
    constructor(readonly time_limit_rate: number, readonly counter: number, readonly bonus: number) {
        super(time_limit_rate, counter, bonus);
    }
    onResist(player: PlayerCharacter): void {
        this.cur++;
        DataManager.statistics.add_counter('Resisted', 1);
    }
}