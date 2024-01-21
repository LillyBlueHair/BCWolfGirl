import { CommandTemplate } from "../ICmds";
import { BasicPrerequisites, NotFullyDressed } from "../Prerequistes";


export const OutfitCmds: CommandTemplate[] = [
    {
        match: /存储色彩方案/,
        prerequisite: BasicPrerequisites,
        run(player) {

        }
    },
    {
        match: /进入维护模式/,
        prerequisite: NotFullyDressed,
        run(player) {

        }
    }
]