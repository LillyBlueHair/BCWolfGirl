import { Prerequisite } from "./Prerequistes";

export type CommandType = "Chat" | "Whisper" | "Beep";

export type CommandArgs = {
    type: CommandType,
    [k: string]: string | number | undefined
};

export interface CommandTemplate {
    type?: CommandType;
    prerequisite: Prerequisite
    match: RegExp;
    run(player: Character, sender: number | Character, content: RegExpExecArray, args: CommandArgs): void;
}
