import { ExitFixSequence } from "../../Control/SequenceCtrl/CtrlSequence";
import { DressFixSequence } from "../../Control/SequenceCtrl/DressSequence";
import { ColorSaveSequence, StartStashPopSequence, StartStashSequence } from "../../Control/SequenceCtrl/StashSequence";
import { DataManager } from "../../Data";
import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites, OutfitFixPrerequisites } from "../Prerequistes";

export const OutfitCmds: CommandTemplate[] = [
    {
        match: /^(存储色彩方案)|(Save color scheme)/i,
        prerequisite: BasicPrerequisites,
        run(player) {
            ColorSaveSequence(player, player);
        },
    },
    {
        match: /^((进入|退出)维护模式)|((enter|exit) Maintainance Mode)/i,
        prerequisite: OutfitFixPrerequisites,
        run(player, sender, content) {
            if (content[2] === "进入" || content[4].toLowerCase() === "Enter") DressFixSequence(sender, player);
            if (content[2] === "退出" || content[4].toLowerCase() === "Exit") ExitFixSequence(player);
        },
    },
    {
        match: /^(切换狼女物品模式)|(Toggle-Wolf-Girl-Item-Mode)/i,
        prerequisite: BasicPrerequisites,
        run(player, sender) {
            if (DataManager.outfit.items.size > 0) {
                StartStashPopSequence(player);
            } else {
                StartStashSequence(player);
            }
        },
    },
];
