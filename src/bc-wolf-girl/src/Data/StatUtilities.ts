import { DataManager } from ".";

export class StatUtilities {
    constructor(readonly parent: DataManager) { }

    add_counter(taskKey: TaskCounterType, count: number) {
        const couter = this.parent.data.stat.task.counter;
        if (couter[taskKey] === undefined) {
            couter[taskKey] = count;
        } else {
            (couter[taskKey] as number) += count;
        }
        this.parent.save();
    }

    task_finished(succeed: boolean) {
        if (succeed) {
            this.parent.data.stat.task.finished++;
        } else {
            this.parent.data.stat.task.failed++;
        }
        this.parent.save();
    }

    add_time(isWolfGirl: boolean, isStashed: boolean, time: number) {
        this.parent.data.stat.script_run_time += time;
        if (isWolfGirl) {
            this.parent.data.stat.wolfgirl_time += time;
        }
        if (isStashed) {
            this.parent.data.stat.stash_time += time;
        }
        this.parent.save();
    }

    set_last_fix_time(time: number) {
        this.parent.data.stat.last_fix_time = time;
        this.parent.save();
    }

}
