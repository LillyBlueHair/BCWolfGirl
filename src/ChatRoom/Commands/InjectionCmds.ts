import { DoInjection } from "../../Control/SequenceCtrl/InjectionSequence";
import { SwitchInjector } from "../../Control/SequenceCtrl/InjectionSequence/SwitchInjector";
import { UniversalDispersalSwitchInjection } from "../../Control/SequenceCtrl/InjectionSequence/SwitchInjector";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites, IsSelf } from "../Prerequistes";

export const InjectionCmds: CommandTemplate[] = [
    {
        match: /^注射麻醉剂/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection('anesthetic');
        }
    },
    {
        match: /^注射恢复剂/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection('pickmeup');
        }
    },
    {
        match: /^注射催情剂/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection('aphrodisiac');
        }
    },
    {
        match: /^注射抑制剂/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection('inhibitor');
        }
    },
    {
        match: /^泛用驱散剂/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection('EasterUniversalDispersal');
        }
    }
]

export const InjectionSwitchCmds: CommandTemplate[] = [
    {
        match: /^身份芯片/,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector('身份芯片', undefined);
        }
    },
    {
        match: /^催情剂/,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector('催情剂', 'aphrodisiac');
        }
    },
    {
        match: /^抑制剂/,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector('抑制剂', 'inhibitor');
        }
    },
    {
        match: /^麻醉剂/,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector('麻醉剂', 'anesthetic');
        }
    },
    {
        match: /^恢复剂/,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector('恢复剂', 'pickmeup');
        }
    }, {
        match: /^泛用驱散剂/,
        prerequisite: IsSelf,
        run(player, sender, content) {
            UniversalDispersalSwitchInjection();
        }
    }
]