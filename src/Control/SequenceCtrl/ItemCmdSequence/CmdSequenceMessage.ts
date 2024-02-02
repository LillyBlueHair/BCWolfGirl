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

export const StdMissingMsgBase: IMessage = { mode: "chat-action", msg: "收到指令，指令执行异常，组件 {missing_formated} 不在线，指令无法完成" }
export const StdMissingMsgN: IMessage = { mode: "chat-action", msg: "收到指令，指令执行异常，组件 {missing_formated} 不在线，对应功能模块组不完整，指令无法完成" }
export const StdMissingMsgNPart: IMessage = { mode: "chat-action", msg: "收到指令，指令执行异常，组件 {missing_formated} 不在线，对应功能模块组不完整，指令无法完全完成" }

export const StdMissing: CmdSequenceMessageItem = {
    notify: StdMissingMsgBase,
    action: { mode: "action", msg: "{player_wg}的中央控制核心小小的发出了错误的嘟声，除此之外什么都没有发生" }
};

