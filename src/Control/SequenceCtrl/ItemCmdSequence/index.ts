import { CommonWork } from "../../CommonWork";
import { IMessage, ParseMessage } from "../../Message";
import { OutfitItemsMap } from "../../OutfitCtrl";
import { ControllerType, CtrlType } from "../../WolfGirlCtrl";
import { RunControls } from "../../WolfGirlCtrl/Ctrls";
import { TestControlWork } from "../../WolfGirlCtrl/Works";
import { TimedWork, TimedWorkState, TimedWorker } from "../../Worker";


interface CmdSequenceMessageItem {
    notify: IMessage;
    action: IMessage;
}

export interface CmdSequenceModeMessage {
    modes: {
        [key in CtrlType]?: CmdSequenceMessageItem;
    }
}

export type CmdSequenceMessage = CmdSequenceModeMessage & {
    missing: CmdSequenceMessageItem;
}

export const StdMissing: CmdSequenceMessageItem = {
    notify: { mode: "chat-action", msg: "收到指令，指令执行异常，组件{丢失物品名称}不在线，指令无法完成" },
    action: { mode: "action", msg: "{player_wg}的中央控制核心小小的发出了错误的嘟声，除此之外什么都没有发生" }
}

export function StdCmdSequence(player: Character, sender: Character, type: ControllerType, mode: CtrlType, messages: CmdSequenceMessage) {

    let xMessage: IMessage | undefined = undefined;
    let do_work = true;

    const work_sequence: TimedWork[] = [
        new TestControlWork("HearingCtrl", mode, (result) => {
            if (result.missing) {
                const missing_formated = result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、");
                ParseMessage(messages.missing.notify, { player }, missing_formated);
                xMessage = messages.missing.action;
                do_work = false;
            }
            else if (result.rejected === "unchanged") {
                ParseMessage({ mode: "chat-action", msg: "收到指令，指令执行异常，当前已处于该工作模式" }, { player });
                xMessage = { mode: "action", msg: "{player_wg}的中央控制核心小小的发出了错误的嘟声，除此之外什么都没有发生" };
                do_work = false;
            }
            else if (result.rejected) {
                ParseMessage({ mode: "chat-action", msg: `收到指令，指令执行发生 WGException.${type}.${result.rejected} 异常，指令无法完成。` }, { player });
                return TimedWorkState.interrupted;
            }
            else {
                const msg = messages.modes[mode];
                if (msg) {
                    ParseMessage(msg.notify, { player });
                    xMessage = msg.action;
                } else {
                    ParseMessage({ mode: "chat-action", msg: `收到指令，指令执行发生 WGException.${type}.MissingDialog.${mode} 异常，指令无法完成。` }, { player });
                    return TimedWorkState.interrupted;
                }
            }
            return TimedWorkState.finished;
        }),
        new CommonWork(() => { if (do_work) RunControls(player, type, mode); }),
        new CommonWork(() => { if (xMessage) ParseMessage(xMessage); }),
    ]

    TimedWorker.global.push({ description: `SetItemSequence${type}`, works: work_sequence });
}

export { ArousalCtrlSequence } from "./ArousalCtrlSequence";
export { HearingCtrlSequence } from "./HearingCtrlSequence";
export { VisionCtrlSequence } from "./VisionCtrlSequence";
export { HandsCtrlSequence } from "./HandsCtrlSequence";
