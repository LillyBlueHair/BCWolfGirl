import { DressFixSequence, ExitFixSequence } from "../../Control/CtrlSequence";
import { GatherDataOutfitItem } from "../../Control/StashOutfit";
import { DataManager } from "../../Data";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites, OutfitFixPrerequisites } from "../Prerequistes";


export const OutfitCmds: CommandTemplate[] = [
    {
        match: /^存储色彩方案/,
        prerequisite: BasicPrerequisites,
        run(player) {
            DataManager.outfit.items = GatherDataOutfitItem(player);
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