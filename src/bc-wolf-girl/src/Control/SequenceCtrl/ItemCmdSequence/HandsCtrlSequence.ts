import { EILNetwork } from "../../../Network";
import { CommonWork, DelayWork } from "../../CommonWork";
import { MessageSimWrongCoding, ParseMessage } from "../../Message";
import { MessageWork } from "../../MessageWork";
import { OutfitItemsMap } from "../../OutfitCtrl";
import { DefaultCheckItemByGroup, CheckMissingItems } from "../../OutfitCtrl/Utils";
import { RandomSinglePunishWork } from "../../PunishWork";
import { ControllerType, TestCtrlMissingResult, TestCtrlResult } from "../../WolfGirlCtrl/IController";
import { CtrlType } from "../../WolfGirlCtrl/IController";
import { RunControls } from "../../WolfGirlCtrl";
import { TestControlWork } from "../../WolfGirlCtrl/Works";
import { TimedWork, TimedWorkState, TimedWorker } from "../../Worker";
import { StdMissing, StdMissingMsgBase, StdMissingMsgN, StdMissingMsgNPart } from "./CmdSequenceMessage";
import { CmdSequenceModeMessage } from "./CmdSequenceMessage";
import { CmdData, StdResultBranch } from "./StdCmdSequence";
import { AppearanceUpdate } from "../../../utils/Apperance";


export function HandsCtrlSequence(player: PlayerCharacter, mode: CtrlType) {

    const messages: CmdSequenceModeMessage = {
        modes: {
            off: {
                notify: { mode: "chat-action", msg: "收到指令，手臂限制已关闭" },
                action: { mode: "action", msg: "{player_wg}手臂上的铐环之间的能量束一点点熄灭，神经干涉模块也关闭了对手臂的控制，而手套上的纳米机械随着小小的震动也尽数回归原位，释放出{player_wg}的手臂与手指令其获得自由，真的是自由吗，亦或者仅仅是片刻的虚妄？" }
            },
            base: {
                notify: { mode: "chat-action", msg: "收到指令，手臂限制已开启" },
                action: { mode: "action", msg: "{player_wg}手臂上的铐环随着话音落下而产生了互相吸引的力量，而电刺激系统与神经干涉模块的协作令手环束紧{player_wg}的力量始终略大于她挣扎反抗的想法，令她只能看着自己的手臂与手指被一点点收拢并且连接好拘束" }
            },
            total: {
                notify: { mode: "chat-action", msg: "收到指令，手臂限制已设置为最强限制模式" },
                action: { mode: "action", msg: "{player_wg}手臂上的铐环骤然束紧，不容置疑的力量甚至稍稍有些令{player_wg}感到疼痛，甚至令她忽略了手套上一点点收紧压迫双拳的纳米机械，双手手臂紧迫收拢与手指手掌的挤压收束，亦或者对{player_wg}的内心来说，是一种更好的情境呢？" }
            }
        }
    };

    const type: ControllerType = "HandsCtrl";

    let data: CmdData = { type, mode };

    const missing_route_01 = (result: TestCtrlMissingResult) => {
        ParseMessage(StdMissingMsgBase, { player }, { missing_formated: result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、") });
        data.xMessage = StdMissing.action;
    }

    const missing_route_02 = (result: TestCtrlMissingResult) => {
        ParseMessage(StdMissingMsgNPart, { player },
            { missing_formated: result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、") });
        data.xMessage = { mode: "action", msg: "{player_wg}的中央控制核心小小的发出了错误的嘟声，随后手套的手指部分缓缓变形并链接收紧，让她的手团成两块无法抓握的肉球" };
        data.mode = "total";
        data.do_work = true;
    }

    const missing_route_03 = (result: TestCtrlMissingResult) => {
        ParseMessage(StdMissingMsgNPart, { player },
            { missing_formated: result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、") });
        data.xMessage = { mode: "action", msg: "{player_wg}手臂上的铐环以一种惩处式的力量快速束起，绷紧{player_wg}的双臂，显然这会造成足够且持续的痛苦" };
        data.mode = "total";
        data.do_work = true;
    }

    const missing_route_04 = (result: TestCtrlMissingResult) => {
        ParseMessage(StdMissingMsgN, { player },
            { missing_formated: result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、") });
        data.xMessage = StdMissing.action;
    }

    const missing_route_05 = (result: TestCtrlMissingResult) => {
        const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、");

        if (DefaultCheckItemByGroup(player, "ItemVulva")) {
            ParseMessage(StdMissingMsgN, { player }, { missing_formated });
            data.xMessage = StdMissing.action;
            return;
        }

        if (CheckMissingItems(player).size >= 5) {
            const err_works: TimedWork[] = [
                new MessageWork("chat-action", "收到指令，手臂限制已关闭"),
                new CommonWork(() => ParseMessage(StdMissingMsgNPart, { player }, { missing_formated })),
                new MessageWork("chat-action", "收到指令，手臂限限限限限限限限......"),
                new MessageWork("action", "{player_wg}的中央控制核心发出了尖锐的持续嘟声，但很快重回寂静"),
                new MessageWork("action", MessageSimWrongCoding(StdMissingMsgBase.msg, 0.5)),
                new RandomSinglePunishWork(),
                new MessageWork("action", MessageSimWrongCoding(StdMissingMsgBase.msg, 0.9)),
                new RandomSinglePunishWork(),
                new DelayWork(1000),
                new RandomSinglePunishWork(),
                new DelayWork(1000),
                new RandomSinglePunishWork(),
                new MessageWork("action", "{player_wg}的中央控制核心再次发出一声尖锐的鸣响，但很快又一次重回沉寂"),
                new MessageWork("chat-action", "检测到指令的错误执行，已终止该指令的执行重试"),
            ];
            TimedWorker.global.insert_after_first({ description: `SetItemSequence${type}`, works: err_works });
            return TimedWorkState.interrupted;
        }

        ParseMessage({ mode: "chat-action", msg: "收到指令，手臂限制已关闭" }, { player });
        mode = "off";
        data.do_work = true;
    }

    const work_sequence: TimedWork[] = [
        new TestControlWork(type, mode, StdResultBranch(player, data, (missing_result, data) => {
            if (missing_result.missing.length === 2) return missing_route_01(missing_result);
            if (mode === "off") return missing_route_05(missing_result);
            if (Math.random() < 0.5) return missing_route_04(missing_result);
            if (missing_result.missing.includes("ItemArms")) return missing_route_02(missing_result);
            if (missing_result.missing.includes("ItemHands")) return missing_route_03(missing_result);
        }, (data) => {
            const msg = messages.modes[mode];
            if (msg) {
                ParseMessage(msg.notify, { player });
                data.xMessage = msg.action;
                data.do_work = true;
            } else {
                ParseMessage({ mode: "chat-action", msg: `[DEBUG] 错误信息: WGException.${data.type}.MissingDialog.${data.mode}` }, { player });
                return TimedWorkState.interrupted;
            }
        })),
        new CommonWork(() => {
            if (data.do_work) {
                RunControls(player, type, data.mode);
                AppearanceUpdate(player);
            }
        }),
        new CommonWork(() => { if (data.xMessage) ParseMessage(data.xMessage, { player }); }),
    ];

    TimedWorker.global.push({ description: `SetItemSequence${type}`, works: work_sequence });
}
