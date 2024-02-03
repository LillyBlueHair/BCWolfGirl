import { AnestheticInjectionSequence, AphrodisiacInjectionSequence, InhibitorInjectionSequence, PickmeupInjectionSequence } from "../../Control/SequenceCtrl/InjectionSequence";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites } from "../Prerequistes";

export const InjectionCmds: CommandTemplate[] = [
    {
        match: /^注射麻醉剂/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            AnestheticInjectionSequence();
        }
    },
    {
        match: /^注射恢复剂/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            PickmeupInjectionSequence();
        }
    },
    {
        match: /^注射催情剂/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            AphrodisiacInjectionSequence();
        }
    },
    {
        match: /^注射抑制剂/,
        prerequisite: BasicPrerequisites,
        run(player, sender, content) {
            InhibitorInjectionSequence();
        }
    }
]