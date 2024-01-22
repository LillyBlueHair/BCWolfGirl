import { GetWolfGrilName } from "../Control/WolfGirlCtrl";
import { DataManager } from "../Data";
import { AppearanceUpdate } from "../utils/Apperance";
import { Commands, PointCommands } from "./Commands";
import { CommandArgs, CommandType } from "./ICmds";


function Strip(src: string) {
    return src.replace(/^[\s\p{P}]*/u, "");
}

export function RunCommands(player: Character, sender: number | Character, content: string, args: CommandArgs) {
    content = Strip(content);
    const usepoints = "使用奖励积分";
    const wgname = GetWolfGrilName(player);
    if (content.startsWith(wgname)) {
        content = content.slice(wgname.length);
        content = Strip(content);

        for (const cmd of Commands) {
            if (cmd.type && cmd.type !== args.type) continue;
            if (!cmd.prerequisite(player, sender)) continue;
            const result = cmd.match.exec(content);
            if (result) {
                cmd.run(player, sender, result, args);
                AppearanceUpdate(player);
                return;
            }
        }
    } else if (content.startsWith(usepoints)) {
        content = content.slice(usepoints.length);
        content = Strip(content);

        for (const cmd of PointCommands) {
            if (cmd.type && cmd.type !== args.type) continue;
            if (!cmd.prerequisite(player, sender)) continue;
            const result = cmd.match.exec(content);
            if (result) {
                cmd.run(player, sender, result, args);
                AppearanceUpdate(player);
                return;
            }
        }
    }
}