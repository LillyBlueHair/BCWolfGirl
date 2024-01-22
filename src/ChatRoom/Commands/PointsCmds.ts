import { ParseMessage } from "../../Control/Message";
import { StartPunish, StopPunish } from "../../Control/PunishWork";
import { GetWolfGrilName, RunControls } from "../../Control/WolfGirlCtrl";
import { DataManager } from "../../Data";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites, SelfPrerequisites } from "../Prerequistes";

export const ModPointsCmds: CommandTemplate[] = [
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
            ParseMessage({ mode: "local", msg: `${GetWolfGrilName(player)}${content[1]}了5积分，当前积分${DataManager.points.points}` })
        }
    },
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