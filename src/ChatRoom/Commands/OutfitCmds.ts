import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites, CollarONPrerequisites } from "../Prerequistes";


export const OutfitCmds: CommandTemplate[] = [
    {
        match: /存储色彩方案/,
        prerequisite: BasicPrerequisites,
        run(player) {

        }
    },
    {
        match: /进入维护模式/,
        prerequisite: CollarONPrerequisites,
        run(player) {

        }
    }
]