import { CommonWork } from "../../CommonWork";
import { IMessage, ParseMessage } from "../../Message";
import { OutfitItemsMap } from "../../OutfitCtrl";
import { ControllerType, TestCtrlMissingResult, TestCtrlResult } from "../../WolfGirlCtrl/IController";
import { CtrlType } from "../../WolfGirlCtrl/IController";
import { RunControls } from "../../WolfGirlCtrl";
import { TestControlWork } from "../../WolfGirlCtrl/Works";
import { TimedWork, TimedWorkState, TimedWorker } from "../../Worker";
import { StdMissing } from "./CmdSequenceMessage";
import { CmdSequenceMessage } from "./CmdSequenceMessage";
import { AppearanceUpdate } from "bc-utilities";

export interface CmdData {
    xMessage?: IMessage | undefined;
    do_work?: boolean;
    type: ControllerType;
    mode: CtrlType;
}

export type CmdMissingCallback = (result: TestCtrlMissingResult, data: CmdData) => TimedWorkState | void;
export type CmdSuccessCallback = (data: CmdData) => TimedWorkState | void;


export function StdResultBranch(player: PlayerCharacter, data: CmdData, on_missing: CmdMissingCallback, on_success: CmdSuccessCallback) {
    return (result: TestCtrlResult) => {
        const call_result = (() => {
            if (result.missing) return on_missing(result as TestCtrlMissingResult, data);
            else if (result.rejected === "unchanged") {
                ParseMessage({ mode: "chat-action", msg: "收到指令，指令执行异常，当前已处于该工作模式" }, { player });
                data.xMessage = StdMissing.action;
            }
            else if (result.rejected) {
                ParseMessage({ mode: "chat-action", msg: `[DEBUG] 错误信息: WGException.${data.type}.Rejected.${result.rejected}` }, { player });
                return TimedWorkState.interrupted;
            }
            else return on_success(data);
        })();
        return call_result ?? TimedWorkState.finished;
    }
}

export function StdCmdSequence(player: PlayerCharacter, type: ControllerType, mode: CtrlType, messages: CmdSequenceMessage) {

    let data: CmdData = { type, mode };

    const work_sequence: TimedWork[] = [
        new TestControlWork(type, data.mode, StdResultBranch(player, data, (missing_result, data) => {
            const missing_formated = missing_result.missing.map(g => OutfitItemsMap.get(g)?.Craft.Name).join("、");
            ParseMessage(messages.missing.notify, { player }, { missing_formated });
            data.xMessage = messages.missing.action;
        }, (data) => {
            const msg = messages.modes[data.mode];
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
