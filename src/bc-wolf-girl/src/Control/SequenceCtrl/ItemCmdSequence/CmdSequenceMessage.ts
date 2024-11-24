import { CtrlType } from "../../WolfGirlCtrl/IController";
import { IMessage } from "../../Message";


export type CmdSequenceMessage = CmdSequenceModeMessage & {
    missing: CmdSequenceMessageItem;
}; export interface CmdSequenceModeMessage {
    modes: {
        [key in CtrlType]?: CmdSequenceMessageItem;
    };
}
export interface CmdSequenceMessageItem {
    notify: IMessage;
    action: IMessage;
}

export const StdMissingMsgBase: IMessage = { mode: "chat-action", msg: "The command was received, but the command execution was abnormal. The component {missing_formated} was not online, so the command could not be completed." }
export const StdMissingMsgN: IMessage = { mode: "chat-action", msg: "The command was received but executed abnormally. The component {missing_formated} is not online. The corresponding functional module group is incomplete. The command cannot be completed." }
export const StdMissingMsgNPart: IMessage = { mode: "chat-action", msg: "The command was received but executed abnormally. The component {missing_formated} is not online. The corresponding functional module group is incomplete. The command cannot be fully completed." }
export const StdMissingAction: IMessage = { mode: "action", msg: "{player_wg}'s central control core makes a small error beep, but other than that nothing happens" }

export const StdMissing: CmdSequenceMessageItem = {
    notify: StdMissingMsgBase,
    action: StdMissingAction
};

