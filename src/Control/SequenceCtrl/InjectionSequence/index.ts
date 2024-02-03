import { CheckItemsWork, CommonWork, DelayWork } from "../../CommonWork";
import { InjectionManager } from "../../Injection";
import { InjectionType } from "../../Injection/IInjection";
import { IMessage, ParseMessage } from "../../Message";
import { MessageWork } from "../../MessageWork";
import { TimedWork, TimedWorkState, TimedWorker } from "../../Worker";
import { StdMissingAction, StdMissingMsgN } from "../ItemCmdSequence/CmdSequenceMessage";

interface InjectionSequenceMsg {
    finish: IMessage;
    f_action: IMessage;
}

function StdInjectionSequence(type: InjectionType, msg: InjectionSequenceMsg) {
    let data = {
        msg: StdMissingAction
    }

    const work_sequence: TimedWork[] = [
        new CheckItemsWork(["ItemTorso2"], (player, result) => {
            if (result.missing) {
                const missing_formated = result.missing.map(g => g.Craft.Name).join("、");
                ParseMessage(StdMissingMsgN, { player }, { missing_formated });
                return TimedWorkState.interrupted;
            } else {
                data.msg = { mode: "chat-action", msg: `收到指令，药物调配中` };
            }
        }),
        new CommonWork((player) => ParseMessage(data.msg, { player })),
        new DelayWork(1000),
        new CommonWork((player) => {
            InjectionManager.instance.doInject(type);
        }),
        new CommonWork((player) => ParseMessage(msg.finish, { player })),
        new CommonWork((player) => ParseMessage(msg.f_action, { player }))
    ]
    TimedWorker.global.push({ description: `InjectionSequence${type}`, works: work_sequence })
}

export function AphrodisiacInjectionSequence() {
    const messages: InjectionSequenceMsg = {
        finish: { mode: "chat-action", msg: "催情剂注射完毕" },
        f_action: { mode: "action", msg: "喔，是催情剂，虽然不会直接导致高潮，但是接下来的每次对情欲的撩拨都会更具冲击，希望{player_wg}不要被快感宠坏了脑子哦" }
    }
    StdInjectionSequence('aphrodisiac', messages);
}

export function InhibitorInjectionSequence() {
    const messages: InjectionSequenceMsg = {
        finish: { mode: "chat-action", msg: "抑制剂注射完毕" },
        f_action: { mode: "action", msg: "{player_wg}的束带为她注射了抑制剂，能短暂的抑制疼痛的效果，但副作用是抑制大脑对快感的感知，如若在发情状态下被注射了这个的话...可不要为了欲望真的太过分对待自己的身体哦？" }
    }
    StdInjectionSequence('inhibitor', messages);
}

export function AnestheticInjectionSequence() {
    const messages: InjectionSequenceMsg = {
        finish: { mode: "chat-action", msg: "麻醉剂注射完毕" },
        f_action: { mode: "action", msg: "失去了反抗能力的{player_wg}似乎只能被任意玩弄，也许几分钟之后我们需要呼叫EIL的回收处理小队来接走被玩坏的她了" }
    }
    StdInjectionSequence('anesthetic', messages);
}

export function PickmeupInjectionSequence() {
    const messages: InjectionSequenceMsg = {
        finish: { mode: "chat-action", msg: "恢复剂注射完毕" },
        f_action: { mode: "action", msg: "随着恢复剂的注射，{player_wg}的身体渐渐有了气力，也逐步得以恢复了对四肢的掌控" }
    }
    StdInjectionSequence('pickmeup', messages);
}