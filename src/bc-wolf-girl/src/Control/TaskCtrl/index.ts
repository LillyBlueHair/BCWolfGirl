import { TaskCtrl } from "./TaskCtrl";
import { DataManager } from "../../Data";
import { ResistTask } from "./ResistTask";
import { InteractTask } from "./InteractTask";
import { BegOrgasmTask } from "./BegOrgasmTask";
import { ParseMessage } from "../Message";
import { ITask } from "./ITask";
import { OrgasmMonitor } from "bc-utilities";


export function TaskCtrlInit(time_reso: number, om: OrgasmMonitor) {
    TaskCtrl.init(time_reso, om);

    const PushTask = (player: PlayerCharacter, t: ITask) => {
        ParseMessage({ mode: "action", msg: `{player_wg}由于奖励点数过低，自动接收任务：\n${t.summary()}` }, { player });
        TaskCtrl.instance.push_task(t);
    }

    const RandomTaskList = [
        (point: number) => new ResistTask(1, 5, point),
        (point: number) => new ResistTask(2, 10, point),
        (point: number) => new InteractTask(2, 10, point, undefined, ['ItemBreast', 'ItemNipplesPiercings', 'ItemNipples']),
        (point: number) => new InteractTask(2, 10, point, undefined, ['ItemVulva', 'ItemPelvis', 'ItemVulvaPiercings']),
        (point: number) => new InteractTask(2, 10, point, ["Slap", "Spank", "Kick", "SpankItem"], undefined),
        (point: number) => new BegOrgasmTask(2, 5, point)
    ]

    let check_timer = Date.now();
    setInterval(() => {
        if (Player && Player.MemberNumber) {
            const now = Date.now();
            const ten_min_after = 10 * 60 * 1000 + check_timer;
            if (TaskCtrl.instance.has_task() || CurrentScreen !== "ChatRoom") check_timer = now;
            else if (now > ten_min_after) {
                check_timer = now;
                if (DataManager.points.points < -14) {
                    const bonus = - 14 - DataManager.points.points;
                    const task = RandomTaskList[Math.floor(Math.random() * RandomTaskList.length)](bonus);
                    PushTask(Player, task);
                }
            }
        }
    }, time_reso);
}