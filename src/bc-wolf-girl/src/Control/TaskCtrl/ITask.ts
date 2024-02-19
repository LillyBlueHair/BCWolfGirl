import { ActivityInfo } from "bc-utilities";
import { CommandType } from "../../ChatRoom/ICmds";

export enum TaskState {
    Running,
    Success,
    Failed
}

export abstract class ITask {
    abstract run(player: PlayerCharacter): TaskState;
    abstract finalize(player: PlayerCharacter, s: TaskState): void;
    onChat(player: PlayerCharacter, sender: Character, msg: string, type: CommandType): void { };
    onActivity(player: PlayerCharacter, sender: Character, activity: ActivityInfo): void { };
    onOrgasm(player: PlayerCharacter): void { };
    onResist(player: PlayerCharacter): void { };
    abstract summary(): string;
}

