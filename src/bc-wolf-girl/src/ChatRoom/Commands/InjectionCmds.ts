import { DoInjection } from "../../Control/SequenceCtrl/InjectionSequence";
import { SwitchInjector } from "../../Control/SequenceCtrl/InjectionSequence/SwitchInjector";
import { UniversalDispersalSwitchInjection } from "../../Control/SequenceCtrl/InjectionSequence/SwitchInjector";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites, IsSelf } from "../Prerequistes";

export const InjectionCmds: CommandTemplate[] = [
    {
        match: /^(注射麻醉剂)|(anesthetic)/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection('anesthetic');
        }
    },
    {
        match: /^(注射恢复剂)|(pickmeup)/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection('pickmeup');
        }
    },
    {
        match: /^(注射催情剂)|(aphrodisiac)/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection('aphrodisiac');
        }
    },
    {
        match: /^(注射抑制剂)|(inhibitor)/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection('inhibitor');
        }
    },
    {
        match: /^(泛用驱散剂)|(EasterUniversalDispersal)/i,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            DoInjection('EasterUniversalDispersal');
        }
    }
]

export const InjectionSwitchCmds: CommandTemplate[] = [
    {
        match: /^(身份芯片)|(ID chip)/i,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector('ID chip', undefined);
        }
    },
    {
        match: /^(催情剂)|(aphrodisiac)/i,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector('aphrodisiac', 'aphrodisiac');
        }
    },
    {
        match: /^(抑制剂)|(inhibitor)/i,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector('inhibitor', 'inhibitor');
        }
    },
    {
        match: /^(麻醉剂)|(anesthetic)/i,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector('anesthetic', 'anesthetic');
        }
    },
    {
        match: /^(恢复剂)|(pickmeup)/i,
        prerequisite: IsSelf,
        run(player, sender, content) {
            SwitchInjector('pickmeup', 'pickmeup');
        }
    }, {
        match: /^(泛用驱散剂)|(EasterUniversalDispersal)/i,
        prerequisite: IsSelf,
        run(player, sender, content) {
            UniversalDispersalSwitchInjection();
        }
    }
]