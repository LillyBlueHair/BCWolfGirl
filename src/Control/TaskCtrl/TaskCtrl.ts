import { ActivityInfo } from "../../utils/ChatMessages";
import { CommandType } from "../../ChatRoom/ICmds";
import { TaskState } from "./ITask";
import { ITask } from "./ITask";

export class TaskCtrl {
    private _active_task: ITask | undefined;

    constructor(time_reso: number) {
        setInterval(() => {
            if (this._active_task) {
                if (Player && Player.MemberNumber) {
                    const s = this._active_task.run(Player);
                    if (s !== TaskState.Running) {
                        this._active_task.finalize(Player, s);
                        this._active_task = undefined;
                    }
                } else {
                    this._active_task = undefined;
                }
            }
        }, time_reso);
    }

    push_task(t: ITask, reject?: (cur: ITask) => void) {
        if (this._active_task) {
            if (reject) reject(this._active_task);
        }
        else this._active_task = t;
    }

    has_task(): boolean {
        return this._active_task !== undefined;
    }

    onChat(player: Character, sender: Character, msg: string, type: CommandType) {
        if (this._active_task) {
            this._active_task.onChat(player, sender, msg, type);
        }
    }

    onActivity(player: Character, sender: Character, activity: ActivityInfo) {
        if (this._active_task) {
            this._active_task.onActivity(player, sender, activity);
        }
    }

    onOrgasm(player: Character) {
        if (this._active_task) {
            this._active_task.onOrgasm(player);
        }
    }

    onResist(player: Character) {
        if (this._active_task) {
            this._active_task.onResist(player);
        }
    }

    private static _instance: TaskCtrl | undefined = undefined;

    static get instance(): TaskCtrl {
        return TaskCtrl._instance as TaskCtrl;
    }

    static init(time_reso: number) {
        if (this._instance) return;
        this._instance = new TaskCtrl(time_reso);
    }
}
