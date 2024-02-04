import { InjectionType } from "../../Control/Injection/IInjection";
import { ParseMessage } from "../../Control/Message";
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

function SwitchInjector(player: Character, mode: string, type: InjectionType | undefined) {
    if (CheckItem(player, ToolsInjector)) {
        InjectionExtend.global.type = type;
        ParseMessage({ mode: "chat-action", msg: "注射器已经切换到 {mode} 模式" }, { player }, { mode });
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