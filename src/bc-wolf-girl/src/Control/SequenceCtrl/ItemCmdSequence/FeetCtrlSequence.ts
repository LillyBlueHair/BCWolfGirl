import { EILNetwork } from "../../../Network";
import { AppearanceUpdate } from "bc-utilities";
import { CommonWork, DelayWork } from "../../CommonWork";
import { IMessage, MessageSimWrongCoding, ParseMessage } from "../../Message";
import { MessageWork } from "../../MessageWork";
import { OutfitItemsMap } from "../../OutfitCtrl";
import { DefaultCheckItemByGroup, CheckMissingItems } from "../../OutfitCtrl/Utils";
import { RandomSinglePunishWork } from "../../PunishWork";
import { RunControls } from "../../WolfGirlCtrl";
import { ControllerType, TestCtrlMissingResult } from "../../WolfGirlCtrl/IController";
import { CtrlType } from "../../WolfGirlCtrl/IController";
import { TestControlWork } from "../../WolfGirlCtrl/Works";
import { TimedWorkState, TimedWork, TimedWorker } from "../../Worker";
import { CmdSequenceModeMessage, StdMissing, StdMissingMsgBase, StdMissingMsgN, StdMissingMsgNPart } from "./CmdSequenceMessage";
import { CmdData, StdResultBranch } from "./StdCmdSequence";


export function FeetCtrlSequence(player: PlayerCharacter, mode: CtrlType) {
    const messages: CmdSequenceModeMessage = {
        modes: {
            off: {
                notify: { mode: "chat-action", msg: "收到指令，行走限制已关闭" },
                action: { mode: "action", msg: "{player_wg}腿部的肢体行动控制器指示灯缓缓熄灭，完全没有了行动限制的双腿也许能久违的伸展，不过不用担心，是跑不掉的" },
            },
            base: {
                notify: { mode: "chat-action", msg: "收到指令，行走限制已开启" },
                action: { mode: "action", msg: "{player_wg}腿部的肢体行动控制器再一次启动，令{player_wg}感到了腿部熟悉的肌肉绵软无力再加上关节僵硬的迟缓限制，铐环之间的能量束则宣扬着{player_wg}目前处于限制状态，可是似乎并不需要能量束链接就已经难以迈步了" },
            },
            total: {
                notify: { mode: "chat-action", msg: "收到指令，行走限制已设置为最强限制模式" },
                action: { mode: "action", msg: "{player_wg}的腿环骤然扯紧，甚至没有给出太多的反应时间，好在动作姿态稳定系统及时介入避免了{player_wg}摔倒在地的痛苦与困扰，不过失去行走能力的她被推倒也只是个时间问题罢了，谁能想到静静站立姿态端庄的{player_wg}实际上连最为简单的迈步都做不到呢？" },
            }
        }
    };

    const type: ControllerType = "FeetCtrl";

    let data: CmdData = { type, mode };

    const missing_route_01 = (result: TestCtrlMissingResult, data: CmdData) => {
        const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、");
        ParseMessage(StdMissingMsgBase, { player }, { missing_formated });
        data.xMessage = StdMissing.action;
    }

    const missing_route_02 = (result: TestCtrlMissingResult, data: CmdData) => {
        const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、");
        ParseMessage(StdMissingMsgNPart, { player }, { missing_formated });
        data.xMessage = { mode: "action", msg: "{player_wg}的肢体行动控制器随着中央控制核心小小的错误嘟声而启动，束紧双腿的同时尽可能的维持着{player_wg}的站立与平衡，但因为行动控制器的异常配置参数导致她近乎只能缓缓挪动" };
        data.mode = "base";
        data.do_work = true;
    }

    const missing_route_03 = (result: TestCtrlMissingResult, data: CmdData) => {
        const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、");
        ParseMessage(StdMissingMsgN, { player }, { missing_formated });
        data.xMessage = { mode: "action", msg: "{player_wg}的肢体行动控制器随着中央控制核心的错误提示音的节奏闪烁了几下，除此之外什么都没有发生" };
    }

    const missing_route_04 = (result: TestCtrlMissingResult, data: CmdData) => {
        const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、");
        ParseMessage(StdMissingMsgN, { player }, { missing_formated });
        data.xMessage = StdMissing.action;
    }

    const missing_route_05 = (result: TestCtrlMissingResult, data: CmdData) => {
        const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、");

        if (DefaultCheckItemByGroup(player, "ItemVulva")) {
            ParseMessage(StdMissingMsgN, { player }, { missing_formated });
            data.xMessage = StdMissing.action;
            return;
        }

        if (CheckMissingItems(player).size >= 5) {
            const err_works: TimedWork[] = [
                new MessageWork("chat-action", "收到指令，行走限制已关闭"),
                new CommonWork(() => ParseMessage(StdMissingMsgNPart, { player }, { missing_formated })),
                new MessageWork("chat-action", "收到指令，行走限限限限限限限限......"),
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

        ParseMessage({ mode: "chat-action", msg: "收到指令，行走限制已关闭" }, { player });
        data.mode = "off";
        data.do_work = true;
    }

    const work_sequence: TimedWork[] = [
        new TestControlWork(type, mode, StdResultBranch(player, data, (missing_result, data) => {
            if (missing_result.missing.length === 3) return missing_route_01(missing_result, data);
            if (mode === "off") return missing_route_05(missing_result, data);
            if (Math.random() < 0.5) return missing_route_04(missing_result, data);
            if (missing_result.missing.length === 1) return missing_route_02(missing_result, data);
            if (missing_result.missing.length === 2) return missing_route_03(missing_result, data);
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
