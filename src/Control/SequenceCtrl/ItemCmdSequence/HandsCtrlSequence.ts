import { EILNetwork } from "../../../Network";
import { CommonWork, DelayWork } from "../../CommonWork";
import { IMessage, MessageSimWrongCoding, ParseMessage } from "../../Message";
import { MessageWork } from "../../MessageWork";
import { OutfitItemsMap } from "../../OutfitCtrl";
import { CheckItemByGroup, CheckMissingItems } from "../../OutfitCtrl/Utils";
import { RandomSinglePunishWork } from "../../PunishWork";
import { ControllerType, CtrlType } from "../../WolfGirlCtrl";
import { RunControls } from "../../WolfGirlCtrl/Ctrls";
import { TestControlWork } from "../../WolfGirlCtrl/Works";
import { TimedWork, TimedWorkState, TimedWorker } from "../../Worker";
import { CmdSequenceModeMessage, StdMissing } from ".";


export function HandsCtrlSequence(player: Character, sender: Character, mode: CtrlType) {

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

    let xMessage: IMessage | undefined = undefined;

    let do_work = true;

    const work_sequence: TimedWork[] = [
        new TestControlWork("HearingCtrl", mode, (result) => {
            if (result.missing) {
                const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、");
                if (mode !== "off") {
                    // 丢失手环或手套其一时触发限制(设置为1或2)，有50%概率触发
                    // 若手环与手套全部丢失，执行任何手部限制指令，则
                    if (Math.random() < 0.5 || result.missing.length === 2) {
                        ParseMessage(StdMissing.notify, { player }, missing_formated);
                        xMessage = StdMissing.action;
                        do_work = false;
                    } else {
                        // 若仅丢失手套时触发限制(设置为1或2)，则
                        if (result.missing.includes("ItemHands")) {
                            ParseMessage({ mode: "chat-action", msg: "收到指令，指令执行异常，组件手套不在线，对应功能模块组不完整，指令无法完全完成" }, { player });
                            xMessage = { mode: "action", msg: "{player_wg}的中央控制核心小小的发出了错误的嘟声，随后手套的手指部分缓缓变形并链接收紧，让她的手团成两块无法抓握的肉球" };
                            mode = "off";
                        }

                        // 若仅丢失手环时触发限制(设置为1或2)，则
                        else if (result.missing.includes("ItemArms")) {
                            ParseMessage({ mode: "chat-action", msg: "收到指令，指令执行异常，组件手臂不在线，对应功能模块组不完整，指令无法完全完成" }, { player });
                            xMessage = { mode: "action", msg: "{player_wg}手臂上的铐环以一种惩处式的力量快速束起，绷紧{player_wg}的双臂，显然这会造成足够且持续的痛苦" };
                            mode = "total";
                        }
                    }
                } else {
                    // 丢失手环或手套其一时关闭限制(设置为0)
                    if (CheckItemByGroup(player, "ItemVulva", EILNetwork.Access.craft)) {
                        ParseMessage(StdMissing.notify, { player }, missing_formated);
                        xMessage = StdMissing.action;
                        do_work = false;
                    }
                    else {
                        // 若身上的未来振动棒已丢失，则
                        // 若身上的未来振动棒已丢失且全身总计丢失件数大于等于5，则
                        if (CheckMissingItems(player, EILNetwork.Access.craft).size >= 5) {
                            const err_works: TimedWork[] = [
                                new MessageWork("chat-action", "收到指令，手臂限制已关闭"),
                                new CommonWork(() => ParseMessage(StdMissing.notify, { player }, missing_formated)),
                                new MessageWork("chat-action", "收到指令，手臂限限限限限限限限......"),
                                new MessageWork("action", "{player_wg}的中央控制核心发出了尖锐的持续嘟声，但很快重回寂静"),
                                new MessageWork("action", MessageSimWrongCoding(StdMissing.notify.msg, 0.5)),
                                new RandomSinglePunishWork(),
                                new MessageWork("action", MessageSimWrongCoding(StdMissing.notify.msg, 0.9)),
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
                        } else {
                            ParseMessage({ mode: "chat-action", msg: "收到指令，手臂限制已关闭" }, { player });
                            mode = "off";
                        }
                    }
                }
            }
            else if (result.rejected === "unchanged") {
                ParseMessage({ mode: "chat-action", msg: "收到指令，指令执行异常，当前已处于该工作模式" }, { player });
                xMessage = { mode: "action", msg: "{player_wg}的中央控制核心小小的发出了错误的嘟声，除此之外什么都没有发生" };
                do_work = false;
            }
            else if (result.rejected) {
                ParseMessage({ mode: "chat-action", msg: `[DEBUG] 错误信息: WGException.${type}.${result.rejected}` }, { player });
                return TimedWorkState.interrupted;
            }
            else {
                const msg = messages.modes[mode];
                if (msg) {
                    ParseMessage(msg.notify, { player });
                    xMessage = msg.action;
                } else {
                    ParseMessage({ mode: "chat-action", msg: `[DEBUG] 错误信息: WGException.${type}.MissingDialog.${mode}` }, { player });
                    return TimedWorkState.interrupted;
                }
            }
            return TimedWorkState.finished;
        }),
        new CommonWork(() => { if (do_work) RunControls(player, type, mode); }),
        new CommonWork(() => { if (xMessage) ParseMessage(xMessage); }),
    ];

    TimedWorker.global.push({ description: `SetItemSequence${type}`, works: work_sequence });
}
