import { IncreaseAndMessage } from "./Points";
import { StartPunish } from "../SequenceCtrl/StartPunishSequence";
import { DataManager } from "../../Data";
import { ITask } from "./ITask";
import { TaskState } from "./ITask";


export abstract class TimedCounterTask extends ITask {
    time_limit_rate: number;
    time_out: number;
    bonus: number;
    cur: number;
    expected: number;

    constructor(time_limit_rate: number, counter: number, bonus: number) {
        super();
        this.time_limit_rate = time_limit_rate;
        this.time_out = DataManager.points.task_time * time_limit_rate + Date.now();
        this.expected = counter;
        this.bonus = bonus;
        this.cur = 0;
    }

    run(player: PlayerCharacter): TaskState {
        if (Date.now() > this.time_out) return TaskState.Failed;
        if (this.cur >= this.expected) return TaskState.Success;
        return TaskState.Running;
    }

    finalize(player: PlayerCharacter, s: TaskState): void {
        if (s === TaskState.Success) IncreaseAndMessage(player, this.bonus);
        else StartPunish(player);
    }
}
