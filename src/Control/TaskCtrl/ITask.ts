import { ActivityInfo } from "../../utils/ChatMessages";
import { CommandType } from "../../ChatRoom/ICmds";

export enum TaskState {
    Running,
    Success,
    Failed
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

