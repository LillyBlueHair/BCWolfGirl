import { ParseMessage } from "../../Control/Message";
import { ItemOptionWork } from "../../Control/OutfitCtrl";
import { StartPunish, StopPunish } from "../../Control/PunishWork";
import { ITask } from "../../Control/TaskCtrl";
import { BegOrgasmTask } from "../../Control/TaskCtrl/BegOrgasmTask";
import { InteractTask } from "../../Control/TaskCtrl/InteractTask";
import { ResistTask } from "../../Control/TaskCtrl/ResistTask";
import { TaskCtrl } from "../../Control/TaskCtrl/TaskCtrl";
import { GetWolfGrilName, RunControls } from "../../Control/WolfGirlCtrl";
import { DataManager } from "../../Data";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites, SelfPrerequisites } from "../Prerequistes";

const PushTask = (player: Character, t: ITask) => {
    ParseMessage({ mode: "action", msg: `${GetWolfGrilName(player)}接收任务：\n${t.summary()}` });
    TaskCtrl.instance.push_task(t, () => {
        ParseMessage({ mode: "action", msg: `接受任务失败：有运行中任务。` });
    });
}

export const TaskPointsCmds: CommandTemplate[] = [
    {
        match: /^忍耐([1-9]\d{0,2})次高潮/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            RunControls(player, "ToysCtrl", "max");
            RunControls(player, "ArousalCtrl", "off");
            PushTask(player, new ResistTask(10 * 60 * 1000, parseInt(content[1]), 2))
        }
    },
    {
        match: /^向([1-9]\d{0,2})人乞求高潮/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            ItemOptionWork.ItemOptionSingleS(player, { target: "ItemPelvis", option: { c: 0 } });
            RunControls(player, "ArousalCtrl", "off");
            PushTask(player, new BegOrgasmTask(30 * 60 * 1000, parseInt(content[1]), 2));
        }
    },
    {
        match: /^让([1-9]\d{0,2})人玩弄你的胸部/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            PushTask(player, new InteractTask(15 * 60 * 1000, parseInt(content[1]), 2, undefined, ['ItemBreast', 'ItemNipplesPiercings', 'ItemNipples']));
        }
    },
    {
        match: /^让([1-9]\d{0,2})人玩弄你的阴部/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            ItemOptionWork.ItemOptionSingleS(player, { target: "ItemPelvis", option: { c: 0 } });
            RunControls(player, "ArousalCtrl", "off");
            PushTask(player, new InteractTask(15 * 60 * 1000, parseInt(content[1]), 2, undefined, ['ItemVulva', 'ItemPelvis', 'ItemVulvaPiercings']));
        }
    },
    {
        match: /^向([1-9]\d{0,2})人乞求鞭打/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            PushTask(player, new InteractTask(15 * 60 * 1000, parseInt(content[1]), 2, ["Slap", "Spank", "Kick", "SpankItem"], undefined));
        }
    },
    {
        match: /^设置惩罚时间为([1-9]\d{0,2})分钟/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            const v = parseInt(content[1]);
            DataManager.points.punish_time = v * 60 * 1000;
            ParseMessage({ mode: "local", msg: `${GetWolfGrilName(player)}的惩罚时间为${v}分钟` })
        }
    },
    {
        match: /^设置任务时间为([1-9]\d{0,2})分钟/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            const v = parseInt(content[1]);
            DataManager.points.punish_time = v * 60 * 1000;
            ParseMessage({ mode: "local", msg: `${GetWolfGrilName(player)}的任务时间为${v}分钟` })
        }
    },
    {
        match: /^(进入|关闭)惩罚模式/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            if (content[1] === "进入") StartPunish(player);
            else StopPunish(player);
        }
    },
    {
        match: /^(扣除|奖励)([1-9]\d{0,2})积分/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            const v = parseInt(content[2]);
            DataManager.points.points += content[1] === "扣除" ? -v : v;
            ParseMessage({ mode: "action", msg: `${GetWolfGrilName(player)}${content[1]}了5积分，当前积分${DataManager.points.points}` }, { player })
        }
    },
    {
        match: /^查询奖励积分/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            ParseMessage({ mode: "action", msg: `${GetWolfGrilName(player)}当前奖励积分：${DataManager.points.points}` })
        }
    }
]

export const SelfPointCmds: CommandTemplate[] = [
    {
        match: /^允许高潮/,
        prerequisite: SelfPrerequisites,
        run(player, sender, content) {
            DataManager.points.use_points(1).then(() => {
                RunControls(player, "ArousalCtrl", "off");
            }, (p) => {
                ParseMessage({ mode: "local", msg: `你没有足够的奖励积分，当前积分${p}` })
            })
        }
    },
    {
        match: /^关闭语言限制/,
        prerequisite: SelfPrerequisites,
        run(player, sender, content) {
            DataManager.points.use_points(1).then(() => {
                RunControls(player, "VoiceCtrl", "off");
            }, (p) => {
                ParseMessage({ mode: "local", msg: `你没有足够的奖励积分，当前积分${p}` })
            })
        }
    },
    {
        match: /^关闭手臂限制/,
        prerequisite: SelfPrerequisites,
        run(player, sender, content) {
            DataManager.points.use_points(1).then(() => {
                RunControls(player, "HandsCtrl", "off");
            }, (p) => {
                ParseMessage({ mode: "local", msg: `你没有足够的奖励积分，当前积分${p}` })
            })
        }
    },
    {
        match: /^关闭行走限制/,
        prerequisite: SelfPrerequisites,
        run(player, sender, content) {
            DataManager.points.use_points(1).then(() => {
                RunControls(player, "FeetCtrl", "off");
            }, (p) => {
                ParseMessage({ mode: "local", msg: `你没有足够的奖励积分，当前积分${p}` })
            })
        }
    },
    {
        match: /^关闭视觉限制/,
        prerequisite: SelfPrerequisites,
        run(player, sender, content) {
            DataManager.points.use_points(1).then(() => {
                RunControls(player, "VisionCtrl", "off");
            }, (p) => {
                ParseMessage({ mode: "local", msg: `你没有足够的奖励积分，当前积分${p}` })
            })
        }
    },
    {
        match: /^关闭听觉限制/,
        prerequisite: SelfPrerequisites,
        run(player, sender, content) {
            DataManager.points.use_points(1).then(() => {
                RunControls(player, "HearingCtrl", "off");
            }, (p) => {
                ParseMessage({ mode: "local", msg: `你没有足够的奖励积分，当前积分${p}` })
            })
        }
    },
]