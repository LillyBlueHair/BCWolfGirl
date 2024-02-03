import { ExitFixSequence } from "../../Control/SequenceCtrl/CtrlSequence";
import { DressFixSequence } from "../../Control/SequenceCtrl/DressSequence";
import { ColorSaveSequence } from "../../Control/SequenceCtrl/StashSequence";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites, OutfitFixPrerequisites } from "../Prerequistes";


export const OutfitCmds: CommandTemplate[] = [
    {
        match: /^存储色彩方案/,
        prerequisite: BasicPrerequisites,
        run(player) {
            ColorSaveSequence(player, player);
        }
    },
    {
        match: /^(进入|退出)维护模式/,
        prerequisite: OutfitFixPrerequisites,
        run(player, sender, content) {
            if (content[1] === '进入') DressFixSequence(sender, player);
            if (content[1] === '退出') ExitFixSequence(player);
        }
    }
]