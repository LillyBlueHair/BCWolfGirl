import { GetWolfGrilName } from "../Control/WolfGirlCtrl";
import { DataManager } from "../Data";
import { AppearanceUpdate } from "../utils/Apperance";
import { Commands } from "./Commands";
import { CommandArgs, CommandType } from "./ICmds";


function Strip(src: string) {
    return src.replace(/^[\s\p{P}]*/u, "");
}

export function RunCommands(player: Character, sender: number | Character, content: string, args: CommandArgs) {
    content = Strip(content);
    const wgname = GetWolfGrilName(player);
    if (!content.startsWith(wgname)) return false;
    content = content.slice(wgname.length);
    content = Strip(content);

    for (const cmd of Commands) {
        if (cmd.type && cmd.type !== args.type) continue;
        if (!cmd.prerequisite.every(p => p(player, sender))) continue;
        const result = cmd.match.exec(content);
        if (result) {
            cmd.run(player, sender, result, args);
            AppearanceUpdate(player);
            return;
        }
    }
}