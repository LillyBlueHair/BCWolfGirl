import { DataManager } from "./DataManager";

export class StatUtilities {
    constructor(readonly parent: DataManager) { }

    private save() {
        this.parent.save("stat");
    }

    add_counter(taskKey: TaskCounterType, count: number) {
        const couter = this.parent.data.stat.task.counter;
        if (couter[taskKey] === undefined) {
            couter[taskKey] = count;
        } else {
            (couter[taskKey] as number) += count;
        }
        this.save();
    }

    task_finished(succeed: boolean) {
        if (succeed) {
            this.parent.data.stat.task.finished++;
        } else {
            this.parent.data.stat.task.failed++;
        }
        this.save();
    }

    add_time_counter: number = 0;
    add_time(isWolfGirl: boolean, isStashed: boolean, time: number) {
        this.parent.data.stat.script_run_time += time;
        if (isWolfGirl) {
            this.parent.data.stat.wolfgirl_time += time;
        }
        if (isStashed) {
            this.parent.data.stat.stash_time += time;
        }
        if (this.add_time_counter++ > 10) {
            this.save();
            this.add_time_counter = 0;
        }
    }

    set_last_fix_time(time: number) {
        this.parent.data.stat.last_fix_time = time;
        this.save();
    }

}
