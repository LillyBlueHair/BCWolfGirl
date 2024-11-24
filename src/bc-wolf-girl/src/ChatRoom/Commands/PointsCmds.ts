import { ParseMessage } from "../../Control/Message";
import { ItemOptionWork } from "../../Control/OutfitCtrl";
import { StopPunish } from "../../Control/PunishWork";
import { StartPunish } from "../../Control/SequenceCtrl/StartPunishSequence";
import { ArousalCtrlSequence, FeetCtrlSequence, HandsCtrlSequence, HearingCtrlSequence, VisionCtrlSequence, VoiceCtrlSequence } from "../../Control/SequenceCtrl/ItemCmdSequence";
import { ITask } from "../../Control/TaskCtrl/ITask";
import { BegOrgasmTask } from "../../Control/TaskCtrl/BegOrgasmTask";
import { InteractTask } from "../../Control/TaskCtrl/InteractTask";
import { ResistTask } from "../../Control/TaskCtrl/ResistTask";
import { TaskCtrl } from "../../Control/TaskCtrl/TaskCtrl";
import { GetWolfGirlName, RunControls } from "../../Control/WolfGirlCtrl";
import { DataManager } from "../../Data";
import { CommandTemplate } from "../ICmds";
import { RouteIM } from "../../Control/Message";
import { BasicPrerequisites, SelfPrerequisites } from "../Prerequistes";
import { TimedWorker } from "../../Control/Worker";
import { MessageWork } from "../../Control/MessageWork";
import { CommonWork } from "../../Control/CommonWork";

const PushTask = (player: PlayerCharacter, t: ITask) => {
    ParseMessage({ mode: "action", msg: `${GetWolfGirlName(player)}Receive Tasks：\n${t.summary()}` });
    TaskCtrl.instance.push_task(t, () => {
        ParseMessage({ mode: "action", msg: `Failed to accept task: There is a task running.` });
    });
}

export const TaskPointsCmds: CommandTemplate[] = [
    {
        match: /^((忍耐)|(endure ))([1-9]\d{0,2})((次高潮)|( orgasms))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            RunControls(player, "ToysCtrl", "max");
            RunControls(player, "ArousalCtrl", "off");
            PushTask(player, new ResistTask(1, parseInt(content[4]), 2))
        }
    },
    {
        match: /^((向)|(Beg for an orgasm from ))([1-9]\d{0,2})((人乞求高潮)|( people))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            ItemOptionWork.ItemOptionSingleS(player, { target: "ItemPelvis", option: { c: 0 } });
            RunControls(player, "ArousalCtrl", "off");
            PushTask(player, new BegOrgasmTask(2, parseInt(content[4]), 2));
        }
    },
    {
        match: /^(让|(let ))([1-9]\d{0,2})(( people play with your breasts)|(人玩弄你的胸部))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            PushTask(player, new InteractTask(1, parseInt(content[3]), 2, undefined, ['ItemBreast', 'ItemNipplesPiercings', 'ItemNipples']));
        }
    },
    {
        match: /^(让|(let ))([1-9]\d{0,2})(( people play with your pussy)|(人玩弄你的阴部))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            ItemOptionWork.ItemOptionSingleS(player, { target: "ItemPelvis", option: { c: 0 } });
            RunControls(player, "ArousalCtrl", "off");
            PushTask(player, new InteractTask(1, parseInt(content[3]), 2, undefined, ['ItemVulva', 'ItemPelvis', 'ItemVulvaPiercings']));
        }
    },
    {
        match: /^(向|(Beg for whipping from ))([1-9]\d{0,2})((人乞求鞭打)|( people))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            PushTask(player, new InteractTask(1, parseInt(content[3]), 2, ["Slap", "Spank", "Kick", "SpankItem"], undefined));
        }
    },
    {
        match: /^((设置惩罚时间为)|(Set the penalty time to ))([1-9]\d{0,2})((分钟)|( minutes))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            const v = parseInt(content[4]);
            DataManager.points.punish_time = v * 60 * 1000;
            ParseMessage({ mode: "chat-action", msg: `Received the instruction, the penalty time of {player_wg} is ${DataManager.points.punish_time / 60 / 1000} minutes` }, { player })
            ParseMessage({ mode: "local", msg: `The cold voice of the mechanical broadcast repeated the consequences of {player_wg}'s mission failure. It seemed to be completely emotionless, but a hint of amusement could be heard.` }, { player })
        }
    },
    {
        match: /^((设置任务时间为)|(Set the task time to ))([1-9]\d{0,2})((分钟)|( minutes))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            const v = parseInt(content[4]);
            DataManager.points.task_time = v * 60 * 1000;
            ParseMessage({ mode: "chat-action", msg: `Received the instruction, the time to finish {player_wg}'s task is ${DataManager.points.task_time / 60 / 1000} minutes` }, { player });
            ParseMessage({ mode: "action", msg: `The cold voice of the mechanical broadcast repeated {player_wg}'s mission time. Tick, tick, is there still time to be dazed? The precise technology will not miss even a second, right?` }, { player });
        }
    },
    {
        match: /^((进入|关闭)惩罚模式)|((Enter|Exit) punishment mode)/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            if (content[2] === "进入" || content[4].toLowerCase() === "enter") StartPunish(player);
            else StopPunish(player);
        }
    }, {
        match: /^(((打开|Turn on )((严厉)|(harsh ))?)|((Turn off )|(关闭)))((高潮惩罚模式)|(Orgasm Punishment mode))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            if (content[1].startsWith("打开") || content[1].toLowerCase().startsWith("Turn on")) {
                TimedWorker.global.push({
                    description: "OrgasmPunishMode", works: [
                        new MessageWork({ mode: "action", msg: "Received the instruction, the orgasm punishment mode has been turned on" }),
                        new CommonWork(() => DataManager.settings.update("orgasmPunishMode", content[4] ? 2 : 1)),
                        new MessageWork({ mode: "chat-action", msg: "The display on {player_wg}'s training underwear lights up with a small icon, a pink heart with a small lightning bolt imposed on it. What does it mean? Why not give it a try? Maybe {player_wg} will like the feeling." }),
                    ]
                });
            } else {
                TimedWorker.global.push({
                    description: "OrgasmPunishMode", works: [
                        new MessageWork({ mode: "action", msg: "Received the instruction, the orgasm punishment mode has been turned off" }),
                        new CommonWork(() => DataManager.settings.update("orgasmPunishMode", 0)),
                        new MessageWork({ mode: "chat-action", msg: "The small punishment icon on the display of {player_wg}'s training underwear gradually goes out.  {player_wg} can now climax freely... right? Is it that {player_wg} wants to be tightly tied up and usher in waves of pleasure?" }),
                    ]
                });

            }
        }
    }, {
        match: /^((设置高潮惩罚时间为)|(Set the penalty time to ))([1-9]\d{0,2})((分钟)|( Minutes))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            const v = parseInt(content[1]);
            DataManager.points.orgasm_punish_time = v * 60 * 1000;
            ParseMessage({ mode: "chat-action", msg: `Received the command, {player_wg}'s orgasm penalty time is ${DataManager.points.orgasm_punish_time / 60 / 1000} minutes` }, { player });
            ParseMessage({ mode: "action", msg: "The cold voice of the mechanical broadcast repeats the price {player_wg} has to pay after reaching orgasm at will. Perhaps with enough desire and hunger, {player_wg} will choose to indulge her body and sink into desire?" }, { player })
        }
    },
    {
        match: /^((扣除|奖励)|((Reward )|(Deduct )))([1-9]\d{0,2})((积分)|( Points))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            const v = parseInt(content[6]);
            const positive = (content[2] === "奖励" || content[4].toLowerCase() === "reward");
            const oper = positive ? "rewarded" : "deducted";
            DataManager.points.points += positive ? v : -v;
            const points = DataManager.points.points;
            RouteIM(args.type, player, sender, "{player_wg} is {oper} {v}points, current points: {points}", { oper, v, points });
        },
    },
    {
        match: /^((查询奖励积分)|(Get reward points))/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content, args) {
            const points = DataManager.points.points;
            RouteIM(args.type, player, sender, "{player_wg} Current reward points: {points}", { points });
            if (DataManager.points.points > 20)
                ParseMessage({ mode: "local", msg: `{player_wg} did a great job, but there is no interest for accumulating points, or maybe you just want a good number? Be careful when you open the query next time, there may be a surprise.` }, { player })
            else if (DataManager.points.points < 0)
                ParseMessage({ mode: "local", msg: `Negative points are not what a good wolf girl should have. Keep working hard, but don't trigger the punishment task. Be careful that after multiple punishments, you will be abandoned and recycled into a living toy. However, with {player_wg}'s figure, maybe living furniture is not bad...` }, { player })
        }
    }
]

export const SelfPointCmds: CommandTemplate[] = [
    {
        match: /^((允许高潮)|(Allow orgasm))/i,
        prerequisite: SelfPrerequisites,
        run(player, sender, content) {
            DataManager.points.use_points(1).then(() => {
                ArousalCtrlSequence(player, "off");
            }, (p) => {
                ParseMessage({ mode: "local", msg: `You do not have enough reward points. Current points: ${p}` })
            })
        }
    },
    {
        match: /^((关闭语言限制)|(Turn off language restrictions))/,
        prerequisite: SelfPrerequisites,
        run(player, sender, content) {
            DataManager.points.use_points(1).then(() => {
                VoiceCtrlSequence(player, "off");
            }, (p) => {
                ParseMessage({ mode: "local", msg: `You do not have enough reward points. Current points: ${p}` })
            })
        }
    },
    {
        match: /^((关闭手臂限制)|(Turn off arm restraints))/i,
        prerequisite: SelfPrerequisites,
        run(player, sender, content) {
            DataManager.points.use_points(1).then(() => {
                HandsCtrlSequence(player, "off");
            }, (p) => {
                ParseMessage({ mode: "local", msg: `You do not have enough reward points. Current points: ${p}` })
            })
        }
    },
    {
        match: /^((关闭行走限制)|(Turn off leg restraints))/i,
        prerequisite: SelfPrerequisites,
        run(player, sender, content) {
            DataManager.points.use_points(1).then(() => {
                FeetCtrlSequence(player, "off");
            }, (p) => {
                ParseMessage({ mode: "local", msg: `You do not have enough reward points. Current points: ${p}` })
            })
        }
    },
    {
        match: /^((关闭视觉限制)|(Turn off visual restrictions))/i,
        prerequisite: SelfPrerequisites,
        run(player, sender, content) {
            DataManager.points.use_points(1).then(() => {
                VisionCtrlSequence(player, "off");
            }, (p) => {
                ParseMessage({ mode: "local", msg: `You do not have enough reward points. Current points: ${p}` })
            })
        }
    },
    {
        match: /^((关闭听觉限制)|(Turn off auditory restrictions))/i,
        prerequisite: SelfPrerequisites,
        run(player, sender, content) {
            DataManager.points.use_points(1).then(() => {
                HearingCtrlSequence(player, "off");
            }, (p) => {
                ParseMessage({ mode: "local", msg: `You do not have enough reward points. Current points: ${p}` })
            })
        }
    },
]