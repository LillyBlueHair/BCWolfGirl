import { InjectionType } from "../../Control/Injection/IInjection";
import { IMessage, ParseMessage } from "../../Control/Message";
import { CheckItem, ToolsInjector } from "../../Control/OutfitCtrl";
import { DoInjection } from "../../Control/SequenceCtrl/InjectionSequence";
import { StdMissingMsgBase } from "../../Control/SequenceCtrl/ItemCmdSequence/CmdSequenceMessage";
import { InjectionExtend } from "../Activity/InjectionExtend";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites, IsSelf } from "../Prerequistes";

export const InjectionCmds: CommandTemplate[] = [
    {
        match: /^注射麻醉剂/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection(player, 'anesthetic');
        }
    },
    {
        match: /^注射恢复剂/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection(player, 'pickmeup');
        }
    },
    {
        match: /^注射催情剂/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection(player, 'aphrodisiac');
        }
    },
    {
        match: /^注射抑制剂/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection(player, 'inhibitor');
        }
    }
]

const switchInjectorMessages: { [key in InjectionType | "chips"]: IMessage } = {
    "anesthetic": { mode: "chat-action", msg: "嘘....也许是该绑走某个目标的时候了，谁会是被看上的幸运儿呢" },
    "pickmeup": { mode: "chat-action", msg: "完全没有反应和动作像死鱼一样玩起来真是没意思，不对吗，猎物的逃跑与挣扎反抗也是捕猎之中的乐趣之一，对吧" },
    "aphrodisiac": { mode: "chat-action", msg: "是要调教，还是玩闹？无论是对别人还是对自己，马上将会有很有趣的事要发生了，不对吗？" },
    "inhibitor": { mode: "chat-action", msg: "如若对一位发情的人注射，那么这无疑是最为严重的惩处，相比于无法高潮，这样能使人甚至都无法感知到太多快感的药剂，可真是恶魔" },
    "chips": { mode: "chat-action", msg: "看起来训练师{player_id}将要捕获一个新的狼女了，不过请不要随意捕获她人并送入狼女流水线哦？" },
}

function SwitchInjector(player: Character, mode: string, type: InjectionType | undefined) {
    if (CheckItem(player, ToolsInjector)) {
        InjectionExtend.global.type = type;
        ParseMessage({ mode: "chat-action", msg: "注射器已经切换到 {mode} 模式" }, { player }, { mode });
        ParseMessage(switchInjectorMessages[type || "chips"], { player });
    } else {
        ParseMessage(StdMissingMsgBase, { player }, { missing_formated: ToolsInjector.Craft.Name });
    }
}

export const InjectionSwitchCmds: CommandTemplate[] = [
    {
        match: /^身份芯片/,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector(player, '身份芯片', undefined);
        }
    },
    {
        match: /^催情剂/,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector(player, '催情剂', 'aphrodisiac');
        }
    },
    {
        match: /^抑制剂/,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector(player, '抑制剂', 'inhibitor');
        }
    },
    {
        match: /^麻醉剂/,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector(player, '麻醉剂', 'anesthetic');
        }
    },
    {
        match: /^恢复剂/,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector(player, '恢复剂', 'pickmeup');
        }
    }
]