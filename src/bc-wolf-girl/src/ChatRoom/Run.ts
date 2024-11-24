import { GetCommandPrefix, GetWolfGirlName } from "../Control/WolfGirlCtrl";
import { AppearanceUpdate } from "bc-utilities";
import { Commands, InjectionSwCommands, PointCommands } from "./Commands";
import { CommandArgs, CommandTemplate } from "./ICmds";


function Strip(src: string) {
    return src.replace(/^[\s\p{P}]*/u, "");
}

export function RunCommands(player: PlayerCharacter, sender: number | Character, content: string, args: CommandArgs) {
    content = Strip(content).toLowerCase();
    const usepoints = "use reward points";
    const switchInjector = "injection gun mode switch";
    const testRegex = GetCommandPrefix(player);

    let cmdSeries: CommandTemplate[] | undefined = undefined;

    const match = testRegex.exec(content);

    if (match) {
        content = content.slice(match[0].length);
        content = Strip(content);
        cmdSeries = Commands;
    } else if (content.startsWith(usepoints)) {
        content = content.slice(usepoints.length);
        content = Strip(content);
        cmdSeries = PointCommands;
    } else if (content.startsWith(switchInjector)) {
        content = content.slice(switchInjector.length);
        content = Strip(content);
        cmdSeries = InjectionSwCommands;
    }

    if (!cmdSeries) return;

    for (const cmd of cmdSeries) {
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