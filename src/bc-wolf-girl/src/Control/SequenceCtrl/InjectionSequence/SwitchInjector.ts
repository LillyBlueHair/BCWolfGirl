import { CheckItemsWork, DelayWork } from "../../CommonWork";
import { IMessage, ParseMessage } from "../../Message";
import { MessageWork } from "../../MessageWork";
import { ToolsInjector } from "../../OutfitCtrl";
import { TimedWork, TimedWorkState, TimedWorker } from "../../Worker";
import { StdMissingMsgBase } from "../ItemCmdSequence/CmdSequenceMessage";
import { InjectionType } from "../../Injection/IInjection";
import { ActivityProvider } from "../../../ChatRoom/Activity";

export type SwitchAvailableType = Exclude<InjectionType, "EasterUniversalDispersal">;

export const switchInjectorMessages: {
    [key in SwitchAvailableType | "chips"]: IMessage;
} = {
    "anesthetic": { mode: "chat-action", msg: "嘘....也许是该绑走某个目标的时候了，谁会是被看上的幸运儿呢" },
    "pickmeup": { mode: "chat-action", msg: "完全没有反应和动作像死鱼一样玩起来真是没意思，不对吗，猎物的逃跑与挣扎反抗也是捕猎之中的乐趣之一，对吧" },
    "aphrodisiac": { mode: "chat-action", msg: "是要调教，还是玩闹？无论是对别人还是对自己，马上将会有很有趣的事要发生了，不对吗？" },
    "inhibitor": { mode: "chat-action", msg: "如若对一位发情的人注射，那么这无疑是最为严重的惩处，相比于无法高潮，这样能使人甚至都无法感知到太多快感的药剂，可真是恶魔" },
    "chips": { mode: "chat-action", msg: "看起来训练师{player_id}将要捕获一个新的狼女了，不过请不要随意捕获她人并送入狼女流水线哦？" },
};

export function SwitchInjector(mode: string, type: SwitchAvailableType | undefined) {
    const work_sequence: TimedWork[] = [
        new CheckItemsWork([ToolsInjector], (player, result) => {
            if (result.missing.length > 0) {
                ParseMessage(StdMissingMsgBase, { player }, { missing_formated: ToolsInjector.Craft.Name });
                return TimedWorkState.interrupted;
            }
            ActivityProvider.instance.injector.type = type
        }, false),
        new MessageWork({ mode: "chat-action", msg: `注射器已经切换到 ${mode} 模式` }),
        new MessageWork({ mode: "chat-action", msg: switchInjectorMessages[type || "chips"].msg }),
    ];
    TimedWorker.global.push({ description: `SwitchInjector${mode}`, works: work_sequence });
}

export function UniversalDispersalSwitchInjection() {
    const work_sequence: TimedWork[] = [
        new CheckItemsWork([ToolsInjector], (player, result) => {
            if (result.missing.length > 0) {
                ParseMessage(StdMissingMsgBase, { player }, { missing_formated: ToolsInjector.Craft.Name });
                return TimedWorkState.interrupted;
            }
        }),
        new MessageWork({ mode: "chat-action", msg: "模式切换完毕，当前模式，泛用驱散剂注射" }),
        new MessageWork({ mode: "action", msg: "以此未曾献与统领世界的影之王的外法之力，将其化为无上珍品" }),
        new DelayWork(2500),
        new MessageWork({ mode: "action", msg: "祈愿五谷丰登，歌颂神圣礼赞" }),
        new DelayWork(2500),
        new MessageWork({ mode: "action", msg: "圣赏崇高赋赐，令其名留青史" }),
        new DelayWork(2500),
        new MessageWork({ mode: "action", msg: "将蔓延的污秽以吾等之澎湃魔力蚀化为泥" }),
        new DelayWork(2500),
        new MessageWork({ mode: "action", msg: "将泛滥的疯狂以吾等之坚定理念遏制无余" }),
        new DelayWork(2500),
        new MessageWork({ mode: "action", msg: "实现意念对物质的彻底干预" }),
        new DelayWork(2500),
        new MessageWork({ mode: "chat-action", msg: "检测的到当前加载的固件出现异常，正在重新载入默认固件" }),
        new DelayWork(5000),
        new MessageWork({ mode: "chat-action", msg: "固件恢复完成" }),
        new MessageWork({ mode: "chat-action", msg: "模式切换完毕，当前模式，泛用驱散剂注射" }),
        new MessageWork({ mode: "action", msg: "复杂的魔力回路，传承的古老血统，繁琐的施术准备，数十年才能成就的大魔法师怎么躲过科技的追赶，科技的低使用门槛从来不是那些需求所谓血脉与出身的魔法侧能相比拟的" })
    ];
    TimedWorker.global.push({ description: `UniversalDispersalInjectionSwitchSequence`, works: work_sequence });
} 
