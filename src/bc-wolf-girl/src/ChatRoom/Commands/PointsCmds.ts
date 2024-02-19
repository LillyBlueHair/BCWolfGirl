import { FormatMessage, ParseMessage } from "../../Control/Message";
import { ItemOptionWork } from "../../Control/OutfitCtrl";
import { StopPunish } from "../../Control/PunishWork";
import { StartPunish } from "../../Control/SequenceCtrl/StartPunishSequence";
import { ArousalCtrlSequence, FeetCtrlSequence, HandsCtrlSequence, HearingCtrlSequence, VisionCtrlSequence, VoiceCtrlSequence } from "../../Control/SequenceCtrl/ItemCmdSequence";
import { ITask } from "../../Control/TaskCtrl/ITask";
import { BegOrgasmTask } from "../../Control/TaskCtrl/BegOrgasmTask";
import { InteractTask } from "../../Control/TaskCtrl/InteractTask";
import { ResistTask } from "../../Control/TaskCtrl/ResistTask";
import { TaskCtrl } from "../../Control/TaskCtrl/TaskCtrl";
import { GetWolfGrilName, RunControls } from "../../Control/WolfGirlCtrl";
import { DataManager } from "../../Data";
import { CommandTemplate } from "../ICmds";
import { RouteIM } from "../../Control/Message";
import { BasicPrerequisites, SelfPrerequisites } from "../Prerequistes";

const PushTask = (player: PlayerCharacter, t: ITask) => {
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
            PushTask(player, new ResistTask(1, parseInt(content[1]), 2))
        }
    },
    {
        match: /^向([1-9]\d{0,2})人乞求高潮/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            ItemOptionWork.ItemOptionSingleS(player, { target: "ItemPelvis", option: { c: 0 } });
            RunControls(player, "ArousalCtrl", "off");
            PushTask(player, new BegOrgasmTask(2, parseInt(content[1]), 2));
        }
    },
    {
        match: /^让([1-9]\d{0,2})人玩弄你的胸部/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            PushTask(player, new InteractTask(1, parseInt(content[1]), 2, undefined, ['ItemBreast', 'ItemNipplesPiercings', 'ItemNipples']));
        }
    },
    {
        match: /^让([1-9]\d{0,2})人玩弄你的阴部/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            ItemOptionWork.ItemOptionSingleS(player, { target: "ItemPelvis", option: { c: 0 } });
            RunControls(player, "ArousalCtrl", "off");
            PushTask(player, new InteractTask(1, parseInt(content[1]), 2, undefined, ['ItemVulva', 'ItemPelvis', 'ItemVulvaPiercings']));
        }
    },
    {
        match: /^向([1-9]\d{0,2})人乞求鞭打/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            PushTask(player, new InteractTask(1, parseInt(content[1]), 2, ["Slap", "Spank", "Kick", "SpankItem"], undefined));
        }
    },
    {
        match: /^设置惩罚时间为([1-9]\d{0,2})分钟/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            const v = parseInt(content[1]);
            DataManager.points.punish_time = v * 60 * 1000;
            RouteIM(args.type, player, sender, `收到指令，{player_wg}的惩罚时间为 ${DataManager.points.punish_time / 60 / 1000} 分钟`);
            ParseMessage({ mode: "local", msg: `机械播报的冰冷声响复述了一遍{player_wg}任务失败的后果，似乎完全没有情感，但是却能听出一丝玩味` }, { player })
        }
    },
    {
        match: /^设置任务时间为([1-9]\d{0,2})分钟/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            const v = parseInt(content[1]);
            DataManager.points.task_time = v * 60 * 1000;
            RouteIM(args.type, player, sender, `收到指令，{player_wg}的任务基础时间为 ${DataManager.points.task_time / 60 / 1000} 分钟`);
            ParseMessage({ mode: "local", msg: `机械播报的冰冷声响复述了一遍{player_wg}的任务时间，滴答，滴答，还有时间发呆吗？精准的科技可不会错漏哪怕一秒哦？` }, { player });
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
        run(player, sender, content, args) {
            const v = parseInt(content[2]);
            const oper = content[1];
            DataManager.points.points += oper === "扣除" ? -v : v;
            const points = DataManager.points.points;
            RouteIM(args.type, player, sender, "{player_wg}{oper}了{v}积分，当前积分{points}", { oper, v, points });
        },
    },
    {
        match: /^查询奖励积分/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            const points = DataManager.points.points;
            RouteIM(args.type, player, sender, "{player_wg}当前奖励积分：{points}", { points });
            if (DataManager.points.points > 20)
                ParseMessage({ mode: "local", msg: `{player_wg}做得很好哦，不过攒着积分可没有利息，亦或者只是单纯的想要一个不错的数字？小心下一次打开查询的时候，也许会有惊喜哦？` }, { player })
            else if (DataManager.points.points < 0)
                ParseMessage({ mode: "local", msg: `负数分可不是好狼女该有的哦，希望你继续努力，可不要触发了惩罚任务哦？小心多次惩罚过后被放弃然后回收做成活体玩具。不过，{player_wg}的身材，也许活体家具也不错？` }, { player })
        }
    }
]

export const SelfPointCmds: CommandTemplate[] = [
    {
        match: /^允许高潮/,
        prerequisite: SelfPrerequisites,
        run(player, sender, content) {
            DataManager.points.use_points(1).then(() => {
                ArousalCtrlSequence(player, "off");
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
                VoiceCtrlSequence(player, "off");
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
                HandsCtrlSequence(player, "off");
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
                FeetCtrlSequence(player, "off");
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
                VisionCtrlSequence(player, "off");
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
                HearingCtrlSequence(player, "off");
            }, (p) => {
                ParseMessage({ mode: "local", msg: `你没有足够的奖励积分，当前积分${p}` })
            })
        }
    },
]