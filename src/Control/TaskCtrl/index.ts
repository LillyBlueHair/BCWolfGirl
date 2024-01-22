import { ActivityInfo } from "../../utils/ChatMessages";
import { CommandType } from "../../ChatRoom/ICmds";
import { IncreaseAndMessage } from "./Points";
import { StartPunish } from "../PunishWork";

export enum TaskState {
    Running,
    Success,
    Failed,
}

export abstract class ITask {
    abstract run(player: Character): TaskState;
    abstract finalize(player: Character, s: TaskState): void;
    onChat(player: Character, sender: Character, msg: string, type: CommandType): void { };
    onActivity(player: Character, sender: Character, activity: ActivityInfo): void { };
    onOrgasm(player: Character): void { };
    onResist(player: Character): void { };
    abstract summary(): string;
}

export abstract class TimedCounterTask extends ITask {
    time_out: number;
    bonus: number;
    cur: number;
    expected: number;

    constructor(time_limit: number, counter: number, bonus: number) {
        super();
        this.time_out = time_limit + Date.now();
        this.expected = counter;
        this.bonus = bonus;
        this.cur = 0;
    }

    run(player: Character): TaskState {
        if (Date.now() > this.time_out) return TaskState.Failed;
        if (this.cur >= this.expected) return TaskState.Success;
        return TaskState.Running;
    }

    finalize(player: Character, s: TaskState): void {
        if (s === TaskState.Success) IncreaseAndMessage(this.bonus);
        else StartPunish(player);
    }
}

