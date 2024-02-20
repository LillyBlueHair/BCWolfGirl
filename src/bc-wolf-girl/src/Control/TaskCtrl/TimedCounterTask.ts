import { IncreaseAndMessage } from "./Points";
import { StartPunish } from "../SequenceCtrl/StartPunishSequence";
import { DataManager } from "../../Data";
import { ITask } from "./ITask";
import { TaskState } from "./ITask";


export abstract class TimedCounterTask extends ITask {
    readonly time_out: number;
    cur: number;

    constructor(readonly time_limit_rate: number, readonly expected: number, readonly bonus: number) {
        super();
        this.time_out = DataManager.points.task_time * time_limit_rate + Date.now();
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
        DataManager.statistics.task_finished(s === TaskState.Success);
    }
}
